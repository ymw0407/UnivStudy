package collection;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class MapTest2 {
    public static void main(String[] args) {
        Map<String, String> map = new HashMap<String, String>();

        map.put("kim", "1234");
        map.put("park", "pass");
        map.put("lee", "word");

        System.out.println(map.get("lee"));// 키를 가지고 값을 참조한다.

        // 1. for-each 구문과 keySet()을 사용한는 방법
        for (var key: map.keySet()) { // 모든 항목을 방문한다. var를 통해서 변수 타입 추론을 사용할 수 있다.
        var value = map.get(key);
        System.out.println("key=" + key + ", value=" + value);
        }

        // 2. 반복자를 사용하는 방법
        Iterator<String> it = map.keySet().iterator();
        while (it.hasNext()){
            String key = it.next();
            System.out.println("key=" + key + ", value=" + map.get(key));
        }

        // 3. Stream 라이브러리를 사용하는 방법
        map.forEach((key, value) -> {
            System.out.println("key=" + key + ", value=" + value);
        });

        System.out.println(map.values()); // 모든 value값들을 list로 반환

        map.remove(3);// 하나의 항목을 삭제한다.

        map.put("choi", "password");// 하나의 항목을 대치한다.

        System.out.println(map);
    }
}
