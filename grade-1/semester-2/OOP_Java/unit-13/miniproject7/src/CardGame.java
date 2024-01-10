import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

class Card {
	String suit;
	String number;

	public Card(String suit, String number) {
		this.suit = suit;
		this.number = number;
	}

	public String toString() {
		return "(" + suit + " " + number + ")";
	}
}

class Deck {
	ArrayList<Card> deck = new ArrayList<Card>();
	public static String[] suit = { "CLUB", "DIAMOND", "HEART", "SPADE" };
	public static String[] number = { "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A" };
	// 카드를 생성하여 덱에 넣는다.

	public Deck() {
		// 52장의 카드를 가지고 잇는 텍을 만든다.
		for (int i = 0; i < suit.length; i++)
			for (int j = 0; j < number.length; j++){
                deck.add(new Card(suit[i], number[j]));
            }
	}

	// 카드를 섞는다.
	public void shuffle() {
		Collections.shuffle(deck);
	}

	// 덱의 처음에서 카드를 제거하여서 반환한다.
	public Card deal() {
		return deck.remove(0);
	}

	public void print() {
		for(int i=0; i<suit.length; i++) {
			for (int j = 0; j < number.length; j++)
				System.out.print(deck.get(i*number.length+j));
			System.out.println();
		}
	}
	
}



class Player {
	Map<String, Integer> map = new HashMap<String, Integer>();
	ArrayList<Card> list = new ArrayList<Card>();
	String topKey;

	public void getCard(Card card) {
		list.add(card);
	}

	public void showCards() {
		System.out.println(list);
	}

	public void selectCards(String filter) {
		map.clear();
		
		for(Card c: list) {
			if(filter != "" && c.suit != filter) continue;
			if(map.containsKey(c.number)) map.put(c.number, map.get(c.number)+1);
			else map.put(c.number, 1);
		}
	}

	public int index(String key) {
		for(int i=0; i<13; i++)
			if(Deck.number[i] == key) return i;
		return -1;
	}

	public String multiple() {
		String result = "";
		selectCards("");
		if (map.containsValue(4)){
			return "fourCard";
		} else if (map.containsValue(3)) {
			int fullCnt = 0;
			for (String key : map.keySet()) {
				if (map.get(key) >= 2) {
					fullCnt += 1;
				}
			}
			if (fullCnt >= 2) {
				return "fullHouse";
			} else if(fullCnt == 1) {
				return "triple";
			}
		} else if (map.containsValue(2)) {
			int multipleCnt = 0;
			for (String key : map.keySet()) {
				if (map.get(key) == 2) {
					multipleCnt += 1;
				}
			}
			if (multipleCnt == 1) {
				return "onePair";
			} else if(multipleCnt == 2) {
				return "twoPair";
			}
		}
		
		return "noPair";
	}

	public String flush() {
		int spade = 0;
		int club = 0;
		int dia = 0;
		int heart = 0;

		for(Card card : list) {
			if (card.suit == "DIAMOND") {
				dia += 1;
			} else if(card.suit == "CLUB") {
				club += 1;
			} else if(card.suit == "SPADE") {
				spade += 1;
			} else {
				heart += 1;
			}
		}
		
		if (dia == 5 || club == 5 || spade == 5 || heart == 5) {
			return "flush";
		}
		return "";
	}

	

	public String straight(String filter) {
		selectCards(filter);
		int cnt = 0;
		String result = "";
		for(String card: Deck.number) {
			// System.out.println(card);
			if (!map.containsKey(card)) {
				cnt = 0;
				continue;
			}
			
			cnt += 1;
			// System.out.println(card + " : " + cnt);
			if (cnt == 5) {
				result = "straight";	
			}
			topKey = card;
		}
		cnt = 0;
		return result;

	}

	

	public String score() {
		String multipleCards = multiple();
		String flushCard = flush();
		String straightCard = straight("");
		String realTop = "";
		String straightFlush = "";

		if(flushCard == "flush") 
			for(String key : Deck.suit) {
				String r = straight(key);
				if(r=="straight") {
					if(realTop=="") realTop = topKey;
					else realTop = (index(topKey) > index(realTop)) ? topKey : realTop;		
				}
				if(r!="" ) straightFlush = "straightFlush";
			}

		if(straightFlush == "straightFlush") 
			return (realTop=="A") ? "royaleStraightFlush" : "straightFlush";
		if(multipleCards == "fourCard" || multipleCards == "fullHouse") return multipleCards;
		if(flushCard == "flush") return flushCard;
            if(straightCard =="straight") return straightCard;
           return multipleCards;
	}

}


public class CardGame {
	public static void main(String[] args) {
		Deck deck = new Deck();
		System.out.println("(before shuffle)"); deck.print();
		deck.shuffle();
		System.out.println("\n(after shuffle)"); deck.print();

		Player p1 = new Player();
		Player p2 = new Player();

		for(int i=1; i<=10; i++) {
			p1.getCard(deck.deal());
			p2.getCard(deck.deal());
		}
		
//		p1.getCard(new Card("HEART", "6"));
//		p1.getCard(new Card("CLUB", "5"));
//		p1.getCard(new Card("DIAMOND", "4"));
//		p1.getCard(new Card("CLUB", "3"));
//		p1.getCard(new Card("CLUB", "2"));
//		p1.getCard(new Card("DIAMOND", "3"));
//		p1.getCard(new Card("SPADE", "4"));
//		p1.getCard(new Card("HEART", "5"));
//		p1.getCard(new Card("SPADE", "6"));
//		p1.getCard(new Card("DIAMOND", "7"));

		System.out.println("\n(player1)"); p1.showCards(); System.out.println("  --> " + p1.score());
		System.out.println("\n(player2)"); p2.showCards(); System.out.println("  --> " + p2.score());

	}

}