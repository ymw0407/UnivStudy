package practice7;

import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class Capital {

	public static void main(String[] args) {
		Scanner sc = new Scanner(System.in);
		Map<String, String> map = new HashMap<String, String>();
		map.put("Korea", "Seoul");
		map.put("USA", "Washington");
		map.put("Japan", "Tokyo");
		map.put("China", "Beijing");
		map.put("UK", "London");
		map.put("France", "Paris");
		map.put("Canada", "Ottawa");
		map.put("Germany", "Berlin");
		
		for(String country : map.keySet()) {
			System.out.println("Key: " + country + ", Value: " + map.get(country));
		}
		
		System.out.print("국가 이름을 입력하시오: ");
		String country = sc.next();
		
		System.out.println(country + "의 수도: " + map.get(country));
	}
}
