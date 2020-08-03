package repository;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;

import model.User;

public class UserRepository {

	public static ObjectMapper mapper = new ObjectMapper();

	public static ArrayList<User> getUsers() {

		try {

			ArrayList<User> users = new ArrayList<User>(Arrays.asList(mapper.readValue(Paths.get(
					"C:\\Users\\Vuk\\Desktop\\Faks\\5_semestar\\Web\\vezbe\\10-REST\\WebShopREST\\WebContent\\files\\users.json")
					.toFile(), User[].class)));

			return users;

		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public static String saveUser(User user) {
		try {
			String json = mapper.writeValueAsString(user);
			ArrayList<User> users = getUsers();
			users.add(user);
			mapper.writeValue(Paths.get(
					"C:\\Users\\Vuk\\Desktop\\Faks\\5_semestar\\Web\\vezbe\\10-REST\\WebShopREST\\WebContent\\files\\users.json")
					.toFile(), users);
			return json;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	public static User findByEmail(String email) {

		try {
			List<User> users = getUsers();
			for (User user : users) {
				if (user.getEmail().equals(email)) {
					return user;
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public static User login(String email, String password) {

		try {
			List<User> users = getUsers();
			for (User user : users) {
				if (user.getEmail().equals(email) && user.getPassword().equals(password)) {
					return user;
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public static boolean deleteUser(String email) {
		try {
			ArrayList<User> users = getUsers();
			users.removeIf(user -> user.getEmail().equals(email));
			mapper.writeValue(Paths.get(
					"C:\\Users\\Vuk\\Desktop\\Faks\\5_semestar\\Web\\vezbe\\10-REST\\WebShopREST\\WebContent\\files\\users.json")
					.toFile(), users);
			return true;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;
	}

}
