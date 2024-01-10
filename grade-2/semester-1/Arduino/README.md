## 중간고사 정리

### 1. 피지컬 컴퓨팅 시스템 및 센서 & 엑추에이터 개념
- 컴퓨터에서 실행되는 프로그램(논리 세계 - logical world)이 현실 세계(physical world)의 사물과 소통하는 시스템

- 임베디드 컴퓨팅 시스템
  - __저비용__ / __경량__ / __저전력__ / __풍부한 입출력 단자__ 가 중요함! 
  - 라즈베리파이, 아두이노, 젯슨나노 등이 그 예시
  
- 센서(Sensor): 현실세계로부터의 __입력__
  - 거리: 초음파, 전파, 레이저
  - 영상: 웹캠, 열화상 카메라, X-Ray 센서
  - 위치정보: GPS, 가속도, 회전속도, 기울기
  - 온도, 습도, 미세먼지, 가스농도, 소리, 진동, 움직임, ...
  
- 액추에이터(Actuator): 현실세계를 향한 __출력__ 
  - 회전운동: DC모터, 스텝모터, 서보모터
  - 직선운동: 리니어 액추에이터
  - 소리: 스피커, 초음파 발신기
  - 빛/시각정보: 레이저 발신기, LED모듈, LCD 디스플레이
  - 진동: 진동모터
  
<br>

### 2. 나사 조립방법
이건... 글쎄요...

<br>

### 3. 브레드보드 사용 및 회로 구성 방법
- 전자회로 프로토타이핑 도구로 납땜 없이 회로 구성 가능하다는 장점이 있지만, 고속 동작 회로는 구현하지 못한다.
- 전원 레일(power rail)과 터미널 스트립(terminal strip)으로 이루어져있고, 터미너 스트립은 5개가 한 묶음이다.
- 각 rail/strip의 hole은 전기적으로 연결되어있다.

<br>

### 4. 아두이노의 setup() 및 loop() 함수의 이해
```C++
#define PIN_LED 13
unsigned int count, toggle;
// 전처리 및 전역변수 선언부로 각종 주변장치나 확장 기능에 대한 헤더파일 추가
// #define이나 typedef 등의 각종 전처리 선언
// 각종 상태값, 제어값들에 대한 전역변수 선언

void setup(){
  Serial.begin(115200);
  Serial.println("아두이노 전원을 켠 직후, 혹은 리셋 버튼을 누른 직후 자동으로 최초 1회만 실행된다. 각종 변수 및 장치 초기화 용도로 사용한다.");
}

void loop(){
  Serial.println("본문으로 setup함수가 실행된 이후 계속 반복적으로 실행된다. 계속 변화하는 외부 입력에 반응하여 출력을 갱신하는 인지-판단-제어 동작 구현에 적합하다.")
}
```

<br>

### 5. int, char, unsigned int 등 자료형 이해
- 1 byte: bool, (unsigned) char
- 2 bytes: (unsigned) int
- 4 bytes: (unsigned) long

<a href="https://codingrun.com/92">아두이노 자료형</a>

<br>

### 6. 시리얼 모니터 설정 방법 이해
```C++
void setup(){
  Serial.begin(115200); // serial 포트를 115200bps로 초기화한다.
  while(!Serial){
    ; // serial port가 연결될 때까지 기다린다. 하지만 이것은 UNO 버전에서는 불필요하다.
  }
}

void loop(){
  Serial.println("Hello World!"); // serial 포트로 메시지 출력
}
```

### 7. LED 회로와 ohm의 법칙
- LED(Light Emission Diode):
  - 전압강하: 1.7v ~ 2.0v(적색 LED)
  - 적정 전류량: 13 ~ 20mA
<br><br>

- 옴의 법칙
  - 전압 강하 `delta V = I * R`
  - 단위는 각각 V, A, ohm

<br>

### 8. 저항 병렬 연결시 전류 변화
- 저항 합성
  - 직렬 연결 `R = R_1 + R_2`
  - 병렬 연결 `1/R = 1/R_1 + 1/R_2`

<br>

### 9. GPIO를 사용한 LED 제어회로 분석
```Arduino
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
```



<br>

### 10. 거리센서 특성 이해
- 전방의 물체(장애물)과 센서 사이의 거리를 측정
- 초음파 / 적외선 / 레이저 / 전파
- FOV(Field Of View, 화각 or 시야각) - 센서가 물체를 인지할 수 있는 범위로 FOV 내에 존재하는 물체 중 가장 가까운 물체의 거리를 인식한다.


<br>

### 11. 초음파센서의 trigeer-echo 시간과 거리 사이의 변환
- 특정 파형의 초음파 발신(ping) 후 수신될 때까지의 시간을 측정
- Trigger: 초음파 발신
- Echo: 초음파 발신 직후 0 -> 1, 수신 직후 1 -> 0으로 출력
<br><br>

- 시간-거리 변환:
  - `Distance(m) = Time(sec) * Speed(m/s)`
  - 상온(24도)에서의 음속: 346(m/s)
  - `Distance(m) = 346 * Time(sec)/2` -> 왕복거리 / 2 -> 거리
  - `Distance(mm) = 173 * Time(ms)`
<br><br>

- Timeout
  - 만약, 초음파가 발신 이후, 수신이 되지 않으면 Timeout이 발생하여, Echo 핀이 수백 ms에서 수초까지도 high로 고정됨, 따라서 timeout이 발생하면, 해당 시간동안 거리 측정 불가
<br><br>

- 측정 대상이 단단한 평면이여야 안정적인 측정이 가능하다.
- 최대 측정 주파수가 초당 40회로 제한되어있다.
- 그 이유는 직전에 발신한 초음파가 사라질 때까지 기다려야하기 때문
- 측정 간격이 지나치게 짧을 경우, 이전에 발신된 초음파를 수신하여, 실제 거리보다 짧게 거리를 인식할 가능성이 있다.
<br><br>

### 12. EMA 필터의 특징
- MA(Moving Average Filter) - 이동 평균 필터
  - 최근의 n개 측정값에 대한 산술평균 값을 최종 측정값으로 사용
  - ex) n = 3일 경우, `(3 + 4 + 5) / 3 = 4.0`
<br><br>

- EMA(Exponential Moving Average) - 지수가중 이동 평균 필터
  - 현재까지의 모든 측정값이 평균 산출에 사용됨
  - 최근 측정치에는 높은 가중치를 부여하고, 이전 측정치의 비중은 지수적으로 감소함
  - MA의 저장공간 및 오래된 측정치를 제거하면, 부담을 줄일 수 있음
  - 부동소수점 연산이 필요

<br>

### 13. EMA 필터 공식의 분석을 통한 예전 측정치의 지수적 감소 특성 이해
`EMA_k = a * d_k + (1-a) * EMA_k-1`

<br>

### 14. 서보모터의 PWM 인터페이스 특징 이해
- 서보모터는 PWM 방식으로 제어한다.
- analogWrite()는 PWM 제어 방식이지만, 서보 제어를 위한 주기 및 duty가 호환되지 않기때문에 아두이노에서 제공하는 전용 PWM 라이브러리를 사용한다.

<br>

### 15. 서보의 펄스 폭과 서버 horn 각도 사이의 변환
