package collection;

import java.util.HashSet;

public class SetTest {
    public static void main(String[] args) {
        HashSet<Integer> set = new HashSet<Integer>();
        
        set.add(1);
        set.add(3);
        set.add(2);
        set.add(7);
        set.add(1);

        if (set.contains(7)){
            System.out.println("7 is exist");
        }
    }
}
