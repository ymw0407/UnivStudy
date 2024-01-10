package collection;

import java.util.Vector;

public class VectorTest {
    public static void main(String[] args) {
        
        Vector vc = new Vector();
        vc.add("Hello World!");
        vc.add(new Integer(10));
        vc.add(20);

        System.out.println("vector size: " + vc.size());
        for (int i = 0; i < vc.size(); i++) {
        System.out.println("vector element " + i + ": " + vc.get(i));
        }
        String s = (String)vc.get(0);
        System.out.println(s);
    }
}
// Vector 클래스와 ArrayList와 기능은 비슷하지만, 동기화, 스레드 안전, 성능, 크기 증가에 있어서 다르다고 하다.
//★ 결론 멀티스레드 환경이 아닌 경우 ArrayList를 사용하는것이 바람직합니다. Vector를 사용하기 위한 명시적 요구 사항이 없는경우 ArrayList를 사용하도록 합시다.