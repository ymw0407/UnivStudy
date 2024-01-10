
import java.io. * ;
import java.util.Scanner;

public class Test {
  public static void main(String[] args) throws Exception {
    Scanner sc = new Scanner(new File("seeds.csv"));
    while (sc.hasNext()) {
      System.out.println(sc.nextLine());
    }
    sc.close();
  }
}