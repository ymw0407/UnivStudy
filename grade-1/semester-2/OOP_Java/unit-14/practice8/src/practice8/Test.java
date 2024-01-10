package practice8;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Scanner;
import java.util.stream.Collectors;

class Country {
	public String name;
	public int population;
	public double gdp;
	public List<City> cities;

	public Country(String name, int population, double gdp, List<City> cities) {
		this.name = name;
		this.population = population;
		this.gdp = gdp;
		this.cities = cities;
	}
}

class City {
	private String name;
	private int population;
	private String countryName;

	@Override
	public String toString() {
		return "City [name=" + name + ", population=" + population + ", countryName=" + countryName + "]";
	}

	public City(String name, int population, String countryName) {
		this.name = name;
		this.population = population;
		this.countryName = countryName;
	}

	public int getPopulation() {
		return population;
	}

	public void setPopulation(int population) {
		this.population = population;
	}
}



public class Test {
	public static void main(String[] args) {
		List<City> cities = Arrays.asList(new City("Busan", 800, "Korea"), new City("Incheon", 500, "Korea"),
				new City("Seoul", 1000, "Korea"));
		List<City> cities2 = Arrays.asList(new City("LA", 2500, "USA"), new City("New York", 3000, "USA"),
				new City("Chicago", 2000, "USA"));
		List<Country> nations = Arrays.asList(new Country("Korea", 5162, 18102, cities), new Country("USA", 33828, 229961, cities2));

		Scanner sc = new Scanner(System.in);
		System.out.print("국가명칭: ");
		String name = sc.nextLine();

         // 다음 문장을 완성함
		Optional<City> max = nations.stream()
				.filter(nation -> nation.name.equals(name))
				.map(nation -> nation.cities) // cities1
				.collect(Collectors.toList())
				.get(0)
				.stream()
				.max(Comparator.comparing(City::getPopulation));
		
		System.out.println(max);
	}
}

