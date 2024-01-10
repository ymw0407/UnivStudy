package chap15_Mini;
import java.io. * ;
import java.util.Scanner;

public class Test {
  public static void main(String[] args) throws Exception {
    Scanner sc = new Scanner(new File("seeds.csv"));
    sc.useDelimiter(",");
    while (sc.hasNext()) {
      System.out.print(sc.next());
    }
    sc.close();
  }
}