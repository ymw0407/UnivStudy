package collection;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class SortTest {
    public static void main(String[] args) {
        Student array[] = {
            new Student(2, "김철수"),
            new Student(3, "이철수"),
            new Student(1, "박철수")
        };

        List<Student> list = Arrays.asList(array);
        System.out.println(list);
        Collections.sort(list);
        System.out.println(list); // 숫자가 가장 큰 순서대로
        // ["이철수", "김철수", "박철수"]
    }
}

class Student implements Comparable<Student>{
    int number;
    String name;

    public Student(int number, String name){
        this.number = number;
        this.name = name;
    }

    public String toString(){
        return name;
    }

    public int compareTo(Student s){
        return s.number - number; // 비교하는 대상이 양수, 비교되는 대상이 음수이기 때문에 결론적으로 비교되는 대상이 클수록 작은수가 리턴된다.
    }
}