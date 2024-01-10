package collection;

import java.util.Map;

public class MapTest {
    public static void main(String[] args) {
        Map<String, String> map = Map.of(
            "kim", "1234",
            "park", "pass",
            "lee", "word"
        );
        //map.put("na", "rrr");  // map.of로 초기화하면 immutalbe 객체로 반환하기 때문에 put이 되지 않는다.
        System.out.println(map);
    }
}
