package collection;

import java.util.LinkedList;
import java.util.Queue;

public class QueueTest {
    public static void main(String[] args) {
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
    }
}
