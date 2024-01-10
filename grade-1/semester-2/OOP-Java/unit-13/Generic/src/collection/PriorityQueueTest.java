package collection;

import java.util.PriorityQueue;

public class PriorityQueueTest {
    public static void main(String[] args) {
        PriorityQueue<Integer> pq = new PriorityQueue<Integer>();
        pq.add(30);
        pq.add(20);
        pq.add(25);
        pq.add(1);

        System.out.println(pq); // 원소들이 무작위로 add되었다고 해도, 정렬된 상태로 원소들을 저장한다.
        System.out.println("삭제된 원소 : " + pq.remove());
    }
}
