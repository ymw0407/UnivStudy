package generic;
//다음 코드와 같이 정수 배열, 실수 배열, 문자 배열을 모두 출력할 수 있는 제네릭 메소드 printArray()를 작성하여 보자.

public class Exampe1 {
    public static void main(String[] args) {
        Integer[] iArray = { 10, 20, 30, 40, 50 };
        Double[] dArray = { 1.1, 1.2, 1.3, 1.4, 1.5 };
        Character[] cArray = { 'K', 'O', 'R', 'E', 'A' };

        printArray(iArray);
        printArray(dArray);
        printArray(cArray);
    }

    public static <T> void printArray(T[] value){ // T 위치 주의!
        for (T each : value){
            System.out.print(each);
        }
        System.out.println();
    }
}