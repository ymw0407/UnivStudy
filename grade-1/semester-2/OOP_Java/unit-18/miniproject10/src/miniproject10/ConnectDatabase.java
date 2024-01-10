package miniproject10;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Scanner;

public class ConnectDatabase {
	public static Connection makeConnection() {
		String url = "jdbc:mysql://localhost:3306/movie_db?characterEncoding=UTF-8 & serverTimezone=UTC";
		String id = "root";
		String password = "0407";
		Connection con = null;
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			System.out.println("드라이버 적재 성공");
			con = DriverManager.getConnection(url, id, password);
			System.out.println("데이터베이스 연결 성공");
		} catch (ClassNotFoundException e) {
			System.out.println("드라이버를 찾을 수 없습니다.");
		} catch (SQLException e) {
			System.out.println("연결에 실패하였습니다.");
		}
		return con;
	}

	public static void main(String arg[]) throws SQLException {
		Connection con = makeConnection();
        Statement stmt;
        ResultSet rs;
        String query, result;
        String title, genre;
        int year, i, id;
        
        Scanner sc = new Scanner(System.in);
        int select;
        
        while(true) {
        System.out.println("------------------");
        System.out.println("메뉴를 선택하세요.");
        System.out.println("(1) Movies 테이블의 모든 내용 출력 기능");
        System.out.println("(2) 새로운 영화 정보 레코드 추가 기능");
        System.out.println("(3) id 값을 입력 받아 Movies 테이블에서 삭제 기능");
        System.out.println("(4) 프로그램 종료");
        System.out.println("------------------");
        
        select = sc.nextInt();
        
        try {
    		stmt = con.createStatement();
    		if (select == 1) {
    			query = "SELECT * FROM Movies";
    			rs = stmt.executeQuery(query);
    	        while(rs.next()) {
    	        	id = rs.getInt("id");
    	        	title = rs.getString("title");
    	        	genre = rs.getString("genre");
    	        	year = rs.getInt("year");
    	        	System.out.println("(id) " + "\"" + id + "\", (title) " + "\"" + title + "\", (genre) " + "\"" + genre + "\", (year) " + year);
    	        }
    		} else if (select == 2) {
    			System.out.print("영화 이름: ");
    			title = sc.next();
    			System.out.print("장르: ");
    			genre = sc.next();
    			System.out.print("년도: ");
    			year = sc.nextInt();
    			query = "Insert into Movies (title, genre, year) VALUES ('" + title + "', '" + genre + "', " + year + ")";
    			i = stmt.executeUpdate(query);
    		} else if (select == 3) {
    			System.out.print("id: ");
    			id = sc.nextInt();
    			query = "DELETE FROM Movies WHERE id = " + id;
    			stmt.executeUpdate(query);
    		} else if (select == 4) break;
    	} catch (SQLException e) {
    		System.out.println(e.getMessage());
    		System.exit(0);
    		}
        }
		con.close();
	}
}