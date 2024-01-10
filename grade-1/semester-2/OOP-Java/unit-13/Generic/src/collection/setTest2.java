package collection;

import java.util.HashSet;

public class setTest2 {
    public static void main(String[] args) {
        HashSet<Integer> set1 = new HashSet<Integer>();
        HashSet<Integer> set2 = new HashSet<Integer>();
        HashSet<Integer> set3 = new HashSet<Integer>();
        HashSet<Integer> set4 = new HashSet<Integer>();
        
        set1.add(1);
        set1.add(2);
        set1.add(3);
        set1.add(7);
        // [1, 2, 3, 7]
        
        set2.add(1);
        set2.add(4);
        set2.add(7);
        set2.add(8);
        // [1, 4, 7, 8]

        if (set1.containsAll(set2)){
            System.out.println("set2는 set1의 부분집합!");
        } else {
            System.out.println("부분집합이 아님!");
        }

        set1.addAll(set2);
        // [1, 2, 3, 4, 7, 8]

        if (set1.containsAll(set2)){
            System.out.println("set2는 set1의 부분집합!");
        } else {
            System.out.println("부분집합이 아님!");
        }

        set1.removeAll(set2);
        // [2, 3]

        set3.add(2);
        set3.add(3);

        if (set1.equals(set3)){
            System.out.println("같다!");
        } else {
            System.out.println("다르다!");
        }

        set2.retainAll(set1);

        if (set2.equals(set4)){
            System.out.println("비었다!");
        } else {
            System.out.println("안비었다!");
        }
    }
}
