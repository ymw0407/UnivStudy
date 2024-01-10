package collection;

import java.util.ArrayList;
import java.util.Scanner;

public class ArrayListTest2 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        ArrayList textList = new ArrayList<String>();
        
        String text1 = sc.next();
        textList.add(text1);

        String text2 = sc.next();
        textList.add(text2);

        String text3 = sc.next();
        textList.add(text3);

        System.out.print("찾을 데이터를 입력해주세요 : ");
        String find = sc.next();

        System.out.println(textList.indexOf(find));
    }    
}
