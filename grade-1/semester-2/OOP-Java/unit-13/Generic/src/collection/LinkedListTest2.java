package collection;

import java.util.LinkedList;

public class LinkedListTest2 {
    public static void main(String[] args) {
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

        if (list.contains("APPLE")){
            System.out.println("APPLE EXISTS");
        }

        String poll2 = list.poll();
        System.out.println(poll2);
        
        // []

        for (int i=0; i<list.size(); i++){
            System.out.println(list.get(i) + " ");
        }
    }
}
