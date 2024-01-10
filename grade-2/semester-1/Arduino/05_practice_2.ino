void setup() {
  pinMode(7, OUTPUT);
  digitalWrite(7, LOW);
  delay(1000);
}

void loop() {
  for(int i = 0; i < 5; i++){
    digitalWrite(7, HIGH);
    delay(100);
    digitalWrite(7, LOW);
    delay(100);
  }
  digitalWrite(7, HIGH);
  while(1){}
}
