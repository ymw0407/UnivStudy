package collection;

import java.util.LinkedList;

public class LinkedListTest {
    public static void main(String[] args) {
        LinkedList<String> list = new LinkedList<String>();
        
        list.add("MILK");
        list.add("BREAD");
        list.add("BUTTER");
        list.add(1 , "APPLE"); // 1번째 위치에 원소를 추가
        list.set(2, "GRAPE"); // 2번째 원소를 해당 원소로 대체
        list.remove(3); // 3번째 인덱스에 있는 원소를 삭제

        for (int i=0; i<list.size(); i++){
            System.out.println(list.get(i) + " ");
        }
    }
}
