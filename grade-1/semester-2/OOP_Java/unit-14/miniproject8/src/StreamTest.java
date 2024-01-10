import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.function.Predicate;
import java.util.stream.Collectors;

class Product {
	int id;
	String name;
	int price;
	double rating;

	@Override
	public String toString() {
		return "Product [id=" + id + ", name=" + name + ", price=" + price + ", rating=" + rating + "]";
	}

	public Product(int id, String name, int price, double rating) {
		super();
		this.id = id;
		this.name = name;
		this.price = price;
		this.rating = rating;
	}

	public static List<Product> find(List<Product> list, Predicate<Product> pr1, Predicate<Product> pr2, Predicate<Product> pr3)
	{
		boolean flag = true;
		List<Product> result = list.stream().filter(pr1.and(pr2).and(pr3)).collect(Collectors.toList());
//		System.out.println(pr1.test(list.get(1)));
		//		list.stream().forEach(ls -> pr1.test(ls) && pr2.test(ls) && pr3.test(ls) ?  : list.remove(ls.id));
		return result;
	}
}


public class StreamTest {
	public static void main(String[] args) {
		Scanner sc = new Scanner(System.in);
		List<Product> list = new ArrayList<Product>();
		list.add(new Product(1, "NoteBook", 100, 3.5));
		list.add(new Product(2, "TV", 320, 3.3));
		list.add(new Product(3, "Washing Machine", 250, 2.3));
		list.add(new Product(4, "Air Conditioner", 500, 2.1));
		list.add(new Product(5, "NoteBook", 160, 4.2));
		list.add(new Product(6, "TV", 550, 4.7));
		list.add(new Product(7, "Washing Machine", 600, 4.8));
		list.add(new Product(8, "Air Conditioner", 800, 4.5));

		System.out.println("상품을 검색하시오.");
		System.out.print("상품의 이름(*은 모든 상품을 의미):");
		String name = sc.nextLine();

		System.out.print("상품의 가격 상한(-1은 상한 없음을 의미):");
		int priceHigh = sc.nextInt();
		System.out.print("상품의 가격 하한(-1은 하한 없음을 의미):");
		int priceLow = sc.nextInt();

		System.out.print("상품의 평점 상한(-1은 상한 없음을 의미):");
		double ratingHigh = sc.nextDouble();
		System.out.print("상품의 평점 하한(-1은 하한 없음을 의미):");
		double ratingLow = sc.nextDouble();

		Predicate<Product> pr1, pr2, pr3;

		pr1 = ls -> name.equals("*") || ls.name.equals(name) ? true : false;
//				n -> {list.stream().forEach(ls -> ls.name == "*" || ls.name == name ? true : false;);}//  구현 위치(2)
		pr2 = ls -> (priceHigh >= ls.price || priceHigh == -1) && (priceLow <= ls.price || priceLow == -1) ? true : false;
		pr3 = ls -> (ratingHigh >= ls.rating || ratingHigh == -1) && (ratingLow <= ls.rating || ratingLow == -1) ? true : false;

		List<Product> result = Product.find(list, pr1, pr2, pr3);
		System.out.println(result);
	}

}