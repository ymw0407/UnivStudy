#include <Servo.h>

// Arduino pin assignment

#define PIN_POTENTIOMETER 3 // Potentiometer at Pin A3
// Add IR Sensor Definition Here !!!
#define PIN_LED 9
#define PIN_SERVO 10

#define DIST_MIN 100
#define DIST_MAX 250

#define _EMA_ALPHA 0.4

#define _DUTY_MIN 553  // servo full clock-wise position (0 degree)
#define _DUTY_NEU 1476 // servo neutral position (90 degree)
#define _DUTY_MAX 2399 // servo full counter-clockwise position (180 degree)

#define LOOP_INTERVAL 50   // Loop Interval (unit: msec)

Servo myservo;
float dist_ema, dist_prev = DIST_MIN;
unsigned long last_loop_time;   // unit: msec

void setup()
{
  pinMode(PIN_LED, OUTPUT);
  myservo.attach(PIN_SERVO); 
  myservo.writeMicroseconds(_DUTY_NEU);
  
  Serial.begin(1000000);
}

void loop()
{
  unsigned long time_curr = millis();
  int a_value, duty, dist;

  // wait until next event time
  if (time_curr < (last_loop_time + LOOP_INTERVAL))
    return;
  last_loop_time += LOOP_INTERVAL;


  // Read IR Sensor value !!!
   a_value = analogRead(PIN_POTENTIOMETER);
  // Convert IR sensor value into distance !!!
  dist = (6762.0/(a_value-9)-4.0)*10.0 - 60.0;
  // we need distance range filter here !!!
  if (dist < DIST_MIN) {
    dist = dist_prev;           // cut lower than minimum
    digitalWrite(PIN_LED, 0);       // LED OFF
  } else if (dist > DIST_MAX) {
    dist= dist_prev;           // Cut higher than maximum
    digitalWrite(PIN_LED, 0);       // LED OFF
  } else {    // In desired Range
    digitalWrite(PIN_LED, 1);       // LED ON   
    dist_prev = dist;
  }
  // we need EMA filter here !!!
  dist_ema = _EMA_ALPHA * dist + (1 - _EMA_ALPHA) * dist_ema;

  // map distance into duty
  if (dist_ema < DIST_MIN) {   
    myservo.writeMicroseconds(_DUTY_MIN);// cut lower than minimum
  } 
  else if (dist_ema > DIST_MAX) {
    myservo.writeMicroseconds(_DUTY_MAX);
  } 
  else{
    myservo.writeMicroseconds(_DUTY_MIN + 12.3 * (dist - 100));
  };

  // print IR sensor value, distnace, duty !!!
  Serial.print("MIN:"); Serial.print(DIST_MIN);
  Serial.print(",IR:"); Serial.print(a_value);
  Serial.print(",dist:"); Serial.print(dist);
  Serial.print(",ema:"); Serial.print(dist_ema);
  Serial.print(",servo:"); Serial.print(duty);
  Serial.print(",MAX:"); Serial.print(DIST_MAX);
  Serial.println("");
}
