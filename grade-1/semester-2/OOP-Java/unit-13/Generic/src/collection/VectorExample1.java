package collection;

import java.util.*;

public class VectorExample1 {
    public static void main(String[] args) {
        Vector<String> vec = new Vector<String>(1); // 처음에 수용량을 정해도 늘어나는듯...?
        System.out.println(vec.capacity()); // 1
        vec.add("Orange");
        System.out.println(vec.capacity()); // 1
        vec.add("Apple");
        System.out.println(vec.capacity()); // 2
        vec.add("Mango");
        System.out.println(vec.capacity()); // 4
        System.out.println("벡터의 크기: "+vec.size());
        Collections.sort(vec);
        for(String s: vec)
            System.out.print(s + " ");
    }
}

// Vector 인스턴스를 생성할때, Vector의 용량을 정할 수 있다.
// 만약, 수용량을 초과하면, 자동으로 용량이 2배로 증가한다.