package practice9;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Scanner;

public class Test {

	public static void main(String[] args) throws IOException {
		File file = new File("Contacts.txt");
		if (file.exists()) {
			file.createNewFile();
		}
		
		FileWriter fw = new FileWriter(file);
		BufferedWriter writer = new BufferedWriter(fw);
		
		Scanner sc = new Scanner(System.in);
		String name, number, phone;
		String[] data;
		
		while(true) {
			System.out.print("이름, 학번, 전화번호: ");
			name = sc.nextLine().trim();
			data = name.split(" ");
			if(name.equals("quit")) {
				break;
			}
			writer.write("이름="+data[0]+", 학번="+data[1]+", 전화번호="+data[2]+"\n");
			
		}
		writer.close();
		System.out.println("contacts.txt에 저장되었습니다.");
	}

}
