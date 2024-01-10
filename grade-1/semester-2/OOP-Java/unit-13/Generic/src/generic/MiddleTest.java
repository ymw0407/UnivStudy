package generic;

public class MiddleTest {
    public static void main(String[] args) {
        Rectangle rec = new Rectangle();
        Box<Rectangle> box = new Box(rec);
        Rectangle test = box.getInstance();
        System.out.println(test.getX());
    }
}

class Box<T> {
    T rectangle;
    public Box(T rectangle){
        this.rectangle = rectangle;
    }
    
    public T getInstance(){
        return rectangle;
    }
}

class Rectangle {
    int x , y;
    public Rectangle(){
        x = 1;
        y = 3;
    }
    public int getX(){
        return this.x;
    }
    public int getY(){
        return this.y;
    }
}