# 13장

## 제너릭이란

제너릭 프로그래밍이란 다양한 종류의 데이터를 처리할 수 있는 클래스와 메소드를 작성하는 기법이다.<br>
`데이터를 포괄적으로 사용할 수 있도록 하는 프로그래밍, 어떤 데이터 타입도 가질 수 있도록 일반화시키는 프로그래밍`

```java
// Box.java
public class Box<T> {
    private T t;

    public void set(T t) {
        this.t = t;
    }

    public T get() {
        return t;
    }
}

// Main.java
public class Main {
    public static void main(String[] args) {
        Box<Integer> box = new Box<Integer>();
        box.set(10)

        Integer i = box.get();
        System.out.println(i.intValue());
    }
}
```

Main 클래스와 같이 Box\<T>에서 T 위치에, 데이터 타입을 넣어 생성하면, 해당 데이터 타입이 T라고 쓰이게 된다.
<br><br>
그렇다면, Generic한 클래스를 사용하지 않아도, Object라는 super class인 객체를 사용하면 되지 않을까?

```java
// Box.java
public class Box {
    private Object t;

    public void set(Object t) {
        this.t = t;
    }

    public Object get() {
        return t;
    }
}

//Main.java
public class Main {
    public static void main(String[] args) {
        Box box = new Box();
		box.set(10);

		// Integer i = box.get(); // 컴파일 에러
		Integer i = (Integer)box.get();
		System.out.println(i.intValue());
    }
}
```

위와 같이 Generic 대신 Object를 사용하게 된다면, 형변환이 필요하다. 그 이유는 슈퍼 클래스인 Object를 서브클래스인 Integer가 참조하는 형태이기 때문이다.<br><br>

하지만, Generic을 사용하면 캐스팅하는 코드가 불필요하다는 것을 알 수 있다.<br>
추가적으로, Generic을 사용하면 컴파일 시점에 잡을 수 없었던 타입 에러를 검출할 수 있다.<br><br>

```
제네릭은 클래스, 메소드에서 사용할 데이터 타입을 나중에 확정하는 기법이다. 나중에라는 말은 클래스나 메소드를 선언할 때가 아닌 사용할 때, 즉 인스턴스를 생성할 때나 메소드를 호출할 때 정한다는 의미이다.
```

[참고 자료](https://atoz-develop.tistory.com/entry/JAVA-%EC%A0%9C%EB%84%A4%EB%A6%ADGenerics-%ED%81%B4%EB%9E%98%EC%8A%A4%EC%99%80-%EB%A9%94%EC%86%8C%EB%93%9C)

```
중간점검!
1. 데이터를 Object 참조형 변수에 저장하는 것이 왜 위험할 수 있는가?
 --> Object의 경우에는, 잘못된 객체를 넣어도 컴파일 단계에서 걸러내지 못한다.

2. Box 객체에 Rectangle 객체를 저장하도록 제너릭을 이용하여 생성하여 보라.
 --> MiddleTest.java 참고

3. 타입 매개 변수 T를 가지는 Point 클래스를 정의하여 보라. Point 클래스는 2차원 공간에서 점을 나타낸다.
 --> 일단 패스...

4. 제너릭 메소드 sub()에서 매개 변수 d를 타입 매개 변수를 이용하여서 정의하여 보라.
 --> public <T> void sub(t d){var = d;}

```

## 컬렉션이란

-   collection은 자바에서 자료구조를 구현한 클래스
-   자료 구조로는 list, stack, queue, set, hash table 등이 있다.
-   Map과 같은 경우에는, Collection 인터페이스를 상속받고 있지는 않지만 Collection으로 분류된다.
-   초기에는 Vector, Stack, HashTable, Bitset, Enumeration으로 존재하였고, 버전 1.2부터는 인터페이스와 구현(List 인터페이스를 ArrayList와 LinkedList 클래스가 구현)을 분리하며, 풍부한 컬렉션 라이브러리를 제공했다.
    <br>

Java Collections Framework(JCF) <br>
┣ Collection(순서나 집합적인 저장 공간) <br>
┃ ┣ List(순서가 있는 저장 공간) <br>
┃ ┃ ┣ LinkedList(링크드리스트) <br>
┃ ┃ ┣ Stack(스택 자료 구조) <br>
┃ ┃ ┣ Vector(동기화 보장) <br>
┃ ┃ ┗ ArrayList(동기화 보장하지 않음) <br>
┃ ┣ Set(집합적인 저장공간) - 인터페이스 클래스 <br>
┃ ┃ ┣ HashSet(Set계열의 대표 클래스) <br>
┃ ┃ ┣ SortedSet(정렬을 위한 Set 계열의 클래스) <br>
┃ ┃ ┗ TreeSet <br>
┣ Map(키와 값으로 데이터 전달) <br>
┃ ┣ Hashtable(동기화 보장하는 Map 계열의 클래스) <br>
┃ ┣ HashMap(동기화 보장하지 않는 Map 계열의 클래스) <br>
┃ ┣ SortedMap(정렬을 위한 Map 계열의 클래스) <br>
┃ ┗ TreeMap <br>

## 컬렉션의 특징

-   컬렉션은 제너릭을 사용한다.
-   컬렉션은 클래스만 받아올 수 있기 때문에 기초 자료형은 저장하지 못하고, 랩퍼 클래스는 저장할 수 있다.
-   기본 자료형을 저장하면, 랩퍼 클래스의 객체로 변환된다.(**auto boxing**)

```java
// Collection 인터페이스의 주요 메소드

boolean isEmpty() // 공백 상태이면 true 반환
boolean contains(Object obj) //obj를 포함하고 있으면 true 반환
boolean containsAll(Collection<?> c) //  특정한 원소들이 모두 있으면 true 반환

boolean add(E element) // 원소를 추가
boolean addAll(Collections<? extends E> c) // 컬렉션에 존재하는 모든 원소들을 추가

boolean remove(Object obj) // 원소를 삭제
boolean removeAll(Collection<?> c) // 컬렉션에 존재하는 모든 원소들을 삭제
boolean retainAll(Collection<?> c) // 컬렉션에 존재하는 원소들을 제외하고 모두 삭제
void clear() // 모든 원소를 삭제

// ---- 원소 방문 ----
Iterator<E> iterator()
Stream<E> stream()
Stream<E> parallelStream()
// ---- 원소 방문 ----

int size() // 원소의 갯수 반환

Object[] toArray()
<T> T[] toArray(T[] toAtrray(T[] a))
```

## 컬렉션의 모든 요소 방문하기

```java
String a[] = new String[] { "A", "B", "C", "D", "E" };
List<String> list = Arrays.asList(a);

// - 1. 전통적인 for 구문을 사용 -
for (int i=0; i<list.size(); i++>)
    System.out.println(list.get(i));

// - 2. 전통적인 for-Each 구문을 사용 -
for (String s:list)
    System.out.println(s);

// - 3. 반복자, Iterator를 사용 -
String s;
Iterator e = list.iterator();
while(e.hasNext()){ // 아직 방문하지 않은 원소가 있으면 true를 반환
    s = (String)e.next(); // 다음 원소를 반환(반복자는 Object type으로 반환! 따라서 casting 필요)
    System.out.println(s);
}

// - 4. Stream 라이브러리를 사용 -
list.forEach((n) -> System.out.println(n));
```

> 중간점검! <br>
1. 컬렉션에는 어떤 것들이 있는가? <br>
 --> 컬렉션에는 크게 List, Set, Map, Queue로 인터페이스 클래스가 있고 세부 클래스들로 구현되어 있다. <br><br>
2. 컬렉션 클래스들은 어디에 이용하면 좋은가? <br>
 --> 글쎄요... <br><br>
3. Colleciton 인터페이스의 각 메소드들의 기능을 자바 API 웹페이지를 이용하여 조사하여 보자 <br>
 --> 일단 패스... <br><br>

## ArrayList & Vector

### ArrayList

-   ArrayList를 배열(Array)의 가변 크기의 배열
-   ArrayList의 생성
    `ArrayList<String> list = new ArrayList<String>();`

### Vector

-   Vector 클래스는 java.util 패키지에 잇는 컬렉션의 일종으로 가변 크기의 배열을 구현하고 있다.
-   Vector의 생성
    `Vector<String> list = new Vector<String>();`

### Vector vs ArrayList

-   Vector는 스레드 간의 동기화를 지원하는데 반하여 ArrayList는 동기화를 하지 않기 대문에 Vector 보다 성능은 우수하다.
    (Vector와 같은 경우에는 동기화를 지원하여 스레드를 차근차근 처리하기 때문에 느리다.)

### ArrayList 기본 연산

```java
// -- add 메소드를 통해서 순서대로 추가 --
list.add( "MILK" );
list.add( "BREAD" );
list.add( "BUTTER" ); // ["MILK", "BREAD", "BUTTER"]

// -- set 메소드를 통해서 해당 Index의 원소를 해당하는 원소로 대체 --
list.set( 1, "APPLE" ); // ["MILK", "APPLE", "BUTTER"]

// -- remove 메소드를 통해서 해당 인덱스의 원소를 제거 --
list.remove( 2 ); // ["MILK", "APPLE"]
```

> 참고: 불행하게도 자바에서는 배열, ArrayList, 문자열 객체의 크기를 알아내는 방법은 약간 다르다. (배열: array.length, ArrayList: arrayList.size(), 문자열: string.length())

> 중간점검! <br>
1. ArrayList가 기존의 배열보다 좋은 점은 무엇인가? <br>
 --> 기존의 배열은 크기가 처음에 정해지는 반면에, ArrayList는 가변배열이다. [참고](https://velog.io/@humblechoi/%EC%9E%90%EB%A3%8C%EA%B5%AC%EC%A1%B0-Array-vs-ArrayList) <br><br>
2. ArrayList의 부모 클래스는 무엇인가? <br>
 --> ArrayList의 부모 클래스는 List이다. <br><br>
3. 왜 인터페이스 참조 변수를 이용하여서 컬렉션 객체들을 참조할까? <br>
 --> 글쎄요... <br><br>
4. ArrayList 안의 객체들을 반복 처리하는 방법들을 모두 설명하라. <br>
 --> for문, for-Each문, while문(get 메소드), Iterator(hasNext, next 메소드), 람다식(forEach 메소드), Stream API <br><br> 

## LinkedList
- 빈번하게 삽입과 삭제가 일어나는 경우에 사용하는 배열
- 기본적인 배열은 배열의 중간에 데이터를 삽입하려면 원소들을 이동해야하지만, linkedList는 연결 리스트 중간에 삽입하려면 링크만 수정하면 된다.

### LinkeList 기본 연산

```java
LinkedList<String> list = new LinkedList<String>();

list.add("BREAD");
list.add("BUTTER");
list.add("APPLE");
// ["BREAD", "BUTTER", "APPLE"]
list.addFirst("MILK");
// ["MILK", "BREAD", "BUTTER", "APPLE"]
list.add(1, "MANGO");
// ["MILK", "MANGO", "BREAD", "BUTTER", "APPLE"]
list.remove(); // 맨 앞 값을 제거
// ["MANGO", "BREAD", "BUTTER", "APPLE"]
list.remove("BREAD"); // Object로도 지울 수 있음!
// ["MANGO", "BUTTER", "APPLE"]
list.remove(2);// index로도 지울 수 있음!
// ["MANGO", "BUTTER"]
list.set(1, "APPLE"); // 인덱스를 통해 대체
// ["MANGO", "APPLE"]

String peeked1 = list.peek(); // 맨 첫 값을 가져온다
System.out.println(peeked1);
String peeked2 = list.peekFirst();
System.out.println(peeked2);

String peeked3 = list.peekLast(); // 맨 마지막 값을 가져온다
System.out.println(peeked3);
String last = list.getLast();
System.out.println(last);

System.out.println("----------------------------");

String poll = list.poll(); // 맨 첫 값을 가져오고 반환
System.out.println(poll);

// ["APPLE"]

String poll2 = list.poll();
System.out.println(poll2);

// []

for (int i=0; i<list.size(); i++){
    System.out.println(list.get(i) + " ");
}
```

### ArrayList vs LinkedList
- ArrayList는 인덱스를 가지고 원소에 접근할 경우, 항상 일정한 시간만 소요된다. ArrayList는 리스트의 각각의 워소를 위하여 노드 객체를 할당할 필요가 없다. 또 동시에 많은 원소를 이동해야 하는 경우에는 System.arraycopy()를 사용할 수 있다.
 
- 만약 리스트의 처음에 빈번하게 원소를 추가하거나 내부의 원소 삭제를 반복하는 경우에느 LinkedList를 사용하는 것이 낫다. LinkedList에서는 일정한 시간만 걸리지만, ArrayList는 원소의 갯수에 비례하는 시간이 소요된다. <br><br>

[참고](https://devlog-wjdrbs96.tistory.com/64)

<br><br>

## Set
- 집합(Set)은 순서가 없고, 원소의 중복을 허용하지 않는다.

### HashSet
- HashSet은 해쉬 테이블에 원소를 저장하기 때문에 성능면에서 가장 우수하다. 하지만, 원소들의 순서가 일정하지 않은 단점이 있다.

### TreeSet
- 레드-블랙 트리(red-black tree)에 원소를 저장한다. 값에 따라서 순서가 결정되지만, HashSet보다는 느리다.

### LinkedHashSet
- 해쉬 테이블과 연결 리스트를 결합한 것으로 원소들의 순서는 삽입되었던 순서와 같다.

### 위 3가지의 차이
- HashSet은 순서를 보장하지 않는다.
- LinkedHashSet은 입력된 순서대로 데이터를 관리한다.
- TreeSet은 오름차순으로 자동 정렬을 해준다.
<br>
[참고](https://velog.io/@ayoung0073/Java-HashSet%EA%B3%BC-LinkedHashSet-%EB%B9%84%EA%B5%90)
<br><br>

### Set 연산

```java
HashSet<String> set = new HashSet<String>();

set.add("Milk");
set.add("Bread");
set.add("Butter");
set.add("Cheese");

if(set.contains("Bread")){ // 해당 원소가 set에 존재하는지 확인
    System.out.println("Bread가 존재한다");
}
```

### 대량 연산 메소드

```java
HashSet<Integer> set1 = new HashSet<Integer>();
HashSet<Integer> set2 = new HashSet<Integer>();
HashSet<Integer> set3 = new HashSet<Integer>();
HashSet<Integer> set4 = new HashSet<Integer>();

set1.add(1);
set1.add(2);
set1.add(3);
set1.add(7);
// [1, 2, 3, 7]

set2.add(1);
set2.add(4);
set2.add(7);
set2.add(8);
// [1, 4, 7, 8]

if (set1.containsAll(set2)){
    System.out.println("set2는 set1의 부분집합!");
} else {
    System.out.println("부분집합이 아님!");
}

set1.addAll(set2);
// [1, 2, 3, 4, 7, 8]

if (set1.containsAll(set2)){
    System.out.println("set2는 set1의 부분집합!");
} else {
    System.out.println("부분집합이 아님!");
}

set1.removeAll(set2);
// [2, 3]

set3.add(2);
set3.add(3);
// [2, 3]

if (set1.equals(set3)){
    System.out.println("같다!");
} else {
    System.out.println("다르다!");
}

set2.retainAll(set1); // 교집합 찾기
//[]

if (set2.equals(set4)){
    System.out.println("비었다!");
} else {
    System.out.println("안비었다!");
}
```

- s1.containAll(s2) - s2가 s1의 부분집합이면 true 반환
- s1.addAll(s2) - s1을 s1과 s2의 합집합으로 만든다.
- s1.retainAll(s2) - s1을 s1과 s2의 교집합으로 만든다.
- s1.removeAll(s2) - s1을 s1과 s2의 차집합으로 만든다.

> 중간점검! <br>
1. Set은 어떤 타입의 애플리케이션에 유용한가? <br>
 --> Set은 중복이 되면 안되는 데이터가 있을때 유용할 것이다. <br><br>
2. Set과 List의 차이점은 무엇인가?
 --> List는 순서가 있는 반면, Set은 순서를 보장하지 않는 collection이다. 또한, Set은 중복이 허용되지 않지만 List의 item은 중복이 허용된다. <br><br>

## Map
- Map은 많은 데이터 중에서 원하는 데이터를 빠르게 찾을 수 있는 자료 구조이다.

```java
Map<String, String> map = Map.of(
    "kim", "1234",
    "park", "pass",
    "lee", "word"
);
//map.put("na", "rrr");  // map.of로 초기화하면 immutalbe 객체로 반환하기 때문에 put이 되지 않는다.
System.out.println(map);
```

```java
Map<String, String> map = new HashMap<String, String>();

        map.put("kim", "1234");
        map.put("park", "pass");
        map.put("lee", "word");

        System.out.println(map.get("lee"));// 키를 가지고 값을 참조한다.

        // 1. for-each 구문과 keySet()을 사용한는 방법
        for (var key: map.keySet()) { // 모든 항목을 방문한다. var를 통해서 변수 타입 추론을 사용할 수 있다.
        var value = map.get(key);
        System.out.println("key=" + key + ", value=" + value);
        }

        // 2. 반복자를 사용하는 방법
        Iterator<String> it = map.keySet().iterator();
        while (it.hasNext()){
            String key = it.next();
            System.out.println("key=" + key + ", value=" + map.get(key));
        }

        // 3. Stream 라이브러리를 사용하는 방법
        map.forEach((key, value) -> {
            System.out.println("key=" + key + ", value=" + value);
        });

        System.out.println(map.values()); // 모든 value값들을 list로 반환

        map.remove(3);// 하나의 항목을 삭제한다.

        map.put("choi", "password");// 하나의 항목을 대치한다.

        System.out.println(map);
```

> 중간점검! <br>
1. Map의 각 원소들은 ___와 ___의 두 부분으로 구성되어 있다. <br>
 --> Key, Value <br><br>
2. Map의 두 가지의 기본적인 연산은 무엇인가? <br>
 --> put과 get 메서드 <br><br>

## 큐(Queue)
- 큐는 후단(tail)에서 원소를 추가하고, 전단(head)에서 원소를 삭제한다.
- 자바에서 큐는 Queue 인터페이스로 정의되며, 이 Queue 인터페이스를 구현한 3개의 클래스가 주어진다. (ArrayDeque, LinkedList, PriorityQueue)

### 큐 기본 연산
```java
Queue<Integer> q = new LinkedList<>();

for (int i = 0; i < 5; i++){
    q.add(i); // 값 추가 성공시 true 반환, 새로운 원소의 추가가 큐의 용량을 넘어서지 않으면 원소를 추가한다. (큐가 꽉 찬 경우 IllegalStateException 에러 발생)
}
System.out.println("큐의 요소: " + q);

q.offer(6); // 값 추가 실패시 false 반환, 성공시 true 반환
System.out.println("큐의 요소: " + q);

int e = q.remove(); // 큐의 처음에 있는 원소를 제거하고 가져온다. (큐가 비었다면 NoSuchElementException 에러 발생)
System.out.println("삭제된 요소: " + e);

int p = q.poll(); // 큐의 처음에 있는 원소를 제거하고 가져온다.(큐가 비었다면 null 반환)
System.out.println("삭제된 요소: " + p);

System.out.println(q);
```

### 우선 순위큐
- 우선 순위큐는 원소들이 무작위로 삽입되었더라도 정렬된 상태로 원소들을 추출한다. 즉 remove()를 호출할 때마다 가장 작은 원소가 추출된다.
- 우선 순위큐는 heap이라고 하는 자료 구조를 내부적으로 사용한다.

```java
PriorityQueue<Integer> pq = new PriorityQueue<Integer>();
pq.add(30);
pq.add(20);
pq.add(25);
pq.add(1);

System.out.println(pq); // 원소들이 무작위로 add되었다고 해도, 정렬된 상태로 원소들을 저장한다.
System.out.println("삭제된 원소 : " + pq.remove());
```

## Collections 클래스
- 정렬(Sorting)
- 섞기(Shuffling)
- 탐색(Searching)

### 정렬
```java
String[] sample = {"i", "walk", "the", "line"};

List<String> list = Arrays.asList(sample); // 배열을 List로 변경

Collections.sort(list); // list를 정렬한다.
System.out.println(list);
```

### 섞기
```java
List<Integer> list = new ArrayList<Integer>();
for (int i=1; i<=10; i++){
    list.add(i);
}
Collections.shuffle(list); // list를 섞는다.
System.out.println(list);
```

### 탐색
- 탐색(Searching)이란 리스트 안에서 원하는 원소를 찾는 것이다. 만약 리스트가 정렬되어 있지 않다면 처음부터 모든 원소를 방문할 수밖에 없다(선형 탐색). 하지만 리스트가 정렬되어 있다면 중간에 있는 원소와 먼저 비교하는 것이 좋다(이진 탐색).

```java
int key = 50;
List<Integer> list = new ArrayList<Integer>();
for (int i=0; i<100; i++){
    list.add(i);
}
int index = Collections.binarySearch(list, key);
System.out.println("탐색의 반환값 = " + index);
```

# 14장
## 함수형 프로그래밍의 소개
함수형 프로그래밍은 하나의 프로그래밍 패러다임으로 정의되는 일련의 코딩 접근 방식이며, __자료처리를 수학적 함수의 계산으로 취급하고 상태와 가변 데이터를 멀리하는 프로그래밍 패러다임__ 을 의미한다. 
<br><br>
프로그래밍 <br>
┣ 명령형 <br>
┃ ┣ 절차 지향 언어(C, FORTRAN) <br>
┃ ┗ 객체 지향 언어(C++, Java) <br>
┣ 선언적 <br>
┃ ┣ 논리 프로그래밍(Prolog) <br>
┃ ┗ 함수형 프로그래밍(Haskell, Erlang)
<br><br>

- 명령형 프로그래밍 : 무엇을 어떻게 하라고 지시한다.
- 선언적 프로그래밍 : 무엇을 하라고만 지시한다. 어떻게는 말하지 않아도 된다. 함수형 프로그래밍에서는 함수들이 계속 적용되면서 작업이 진행된다. 함수형 프로그램은 명령문이 아닌 수식이나 __함수 호출__ 로 이루어진다.
<br>

[참고 1](https://jongminfire.dev/%ED%95%A8%EC%88%98%ED%98%95-%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D%EC%9D%B4%EB%9E%80)
<br>

[참고 2](https://iborymagic.tistory.com/73)
<br><br>


### 멀티코어 시대의 함수형 프로그래밍
- 함수형 프로그래밍이 병렬 처리가 쉽다는 것이다.최근 CPU는 모두 멀티코어를 장착하고 있고 함수형 프로그래밍에서는 부작용 없는 순수 함수만을 사용하기 때문에 코어를 여러 개 사용하여도 서로 간에 복잡한 문제가 발생하지 않는다.
<br><br>

### 함수란 무엇인가?
함수형 프로그래밍에서 함수는 __순수 함수(pure function)__ 라고 하며, 순수 함수는 __부작용(side effect, 함수가 외부의 변수를 변경시키는)__ 이 없는 함수를 말한다. <br>
명령형 프로그래밍에서의 함수는 외부의 상태에 따라 서로 다른 결과값을 반환할 수 있다. (Random 클래스가 그 예이다. 호출될 때마다 난수 발생기의 상태가 변경되고 따라서 반환값이 달라진다.) <br>
순수 함수는 스레드에 대하여 안전하고, 병렬적인 계산이 가능하다. <br><br>

### 객체 지향 프로그래밍과 함수형 프로그래밍
| 객체 지향 프로그래밍(OOP) | 함수형 프로그래밍 |
| :---------------------: | :--------------: |
| OOP는 객체에 기반을 두고 있다. | 함수 호출을 기본 프로그래밍 블록으로 강조한다.|
| OOP는 명령형 프로그래밍 모델에 따른다.| 선언적 프로그래밍과 밀접하게 연결되어 있다.|
| 병렬 처리를 지원하지 않는다. | 병렬 처리를 지원한다. |
| 기본적인 요소는 객체와 메소드이다. | 기본적인 요소는 변수와 순수 함수이다. |
| 코드/함수 \<---> 코드/함수 | 코드 -> 데이터 -> 코드 |

> 중간점검! <br>
1. 순수 함수란 무엇인가? <br>
 --> 순수 함수는 부작용이 없으며(동일한 인자가 들어가면 항상 같은 값이 나와야 함. 지역변수만 사용되야 됨) 평가 시점이 중요하지 않은 함수이다. <br><br>
2. 명령형 프로그래밍 방식과 선언적 프로그래밍 방식을 비교해보자. <br>
 --> 명령형 프로그래밍 방식에서는 how, 무엇을 어떻게 진행하는지가 중요하며 선언적 프로그래밍에서는 what, 무엇인지만이 중요하다. 따라서 선언적 프로그래밍에서는 많은 추상화가 이루어진다. <br><br>
3. 함수형 프로그래밍의 장점을 2가지만 들어보자. <br>
 --> 가독성이 높다. 유지보수가 용이하다.(거의 모든 것을 순수 함수로 나누어 문제를 해결하기 때문이다.) <br><br>
4. 병렬 처리 관점에서는 어떤 방식이 더 좋은가? 그 이유는 무엇일까? <br>
 --> 함수 자체가 독립적이며 Side-Effect가 없기 때문에 Thread에 안정성을 보장받아 병렬 처리를 동기화 없이 진행할 수 있다. <br><br>

### 함수의 1급 시민 승격
java 8에서 함수가 1급 시민으로 승격되었다.
- 함수도 변수에 저장할 수 있다.
- 함수를 매개 변수로 받을 수 있다.
- 함수를 반환할 수 있다.

### 람다식
람다식(lambda expression)은 나중에 실행될 목적으로 다른 곳에서 전달될 수 있는 코드 블록이다.
```java
(int a, int b) -> { return a + b ;} 
// 람다식 매개 변수 / 람다식 연산자 / 람다식 몸체
```
- 람다식은 0개 이상의 매개 변수를 가질 수 있다.
- 매개 변수의 형식을 명시적으로 선언할 수 있으며, 문맥에서 추정될 수 있는 경우 int a와 a는 동일하다.
- 단일 매개 변수이고 타입은 유추가 가능한 경우에는 괄호를 사용할 필요가 없다. (ex. a -> return a*a)
- 몸체에 하나 이상의 문장이 있으면 {}로 묶어야 한다.