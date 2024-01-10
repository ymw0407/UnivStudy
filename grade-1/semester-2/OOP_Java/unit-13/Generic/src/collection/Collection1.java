package collection;

import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

public class Collection1 {
    public static void main(String[] args) {
        String a[] = new String[] { "A", "B", "C", "D", "E" };
        List<String> list = Arrays.asList(a);

        // - 1. 전통적인 for 구문을 사용 -
        // for (int i=0; i<list.size(); i++)
        //     System.out.println(list.get(i));

        // // - 2. 전통적인 for 구문을 사용 -
        // for (String s:list)
        //     System.out.println(s);

        // // - 3. 반복자, Iterator를 사용 -
        // String s;
        // Iterator e = list.iterator();
        // while(e.hasNext()){ // 아직 방문하지 않은 원소가 있으면 true를 반환
        //     s = (String)e.next(); // 다음 원소를 반환(반복자는 Object type으로 반환! 따라서 casting 필요)
        //     System.out.println(s);
        // }

        // - 4. Stream 라이브러리를 사용 -
        list.forEach((n) -> System.out.println(n));
    }
}
