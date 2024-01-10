package generic;

public class Generic3<T> { // Generic 클래스
    // 이와 같이 제너릭 메소드는 static이 가능하다. 그 이유는 generic method는 호출 시에 매게 타입을 결정하기 때문!
    // static T getName(T name)과 어떤 차이가 있냐... -> 앞에 <T>를 통해서 Generic method로 선언!
    static <T> T getOneStudent(T id) { // Generic 메소드(클래스의 제네릭 타입이 전역 변수처럼 사용된다면 메소드의 제네릭 타입은 해당 메소드 안에서만 사용할 수 있는 지역성을 갖는다.)
        return id;
    }

}
