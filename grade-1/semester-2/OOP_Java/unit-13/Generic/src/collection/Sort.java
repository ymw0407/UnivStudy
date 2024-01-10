package collection;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class Sort {
    public static void main(String[] args) {
        String[] sample = {"i", "walk", "the", "line"};

        List<String> list = Arrays.asList(sample); // 배열을 List로 변경

        Collections.sort(list); // list를 정렬한다.
        System.out.println(list); // [i, line, the, walk]
    }
}
