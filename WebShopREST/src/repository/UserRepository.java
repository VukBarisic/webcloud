package repository;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import com.fasterxml.jackson.databind.ObjectMapper;
import model.User;

public class UserRepository {

	public static ObjectMapper mapper = new ObjectMapper();

	public static String pathUsers = "C:\\Users\\Vuk\\Desktop\\Faks\\5_semestar\\Web\\vezbe\\10-REST\\WebShopREST\\WebContent\\files\\users.json";

	public static ArrayList<User> getUsers() {

		try {

			ArrayList<User> users = new ArrayList<User>(
					Arrays.asList(mapper.readValue(Paths.get(pathUsers).toFile(), User[].class)));

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
			mapper.writeValue(Paths.get(pathUsers).toFile(), users);
			return json;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	public static User findByEmail(String email) {
		List<User> users = getUsers();
		for (User user : users) {
			if (user.getEmail().equals(email)) {
				return user;
			}

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
			mapper.writeValue(Paths.get(pathUsers).toFile(), users);
			return true;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;
	}

	public static boolean isUniqueEmail(String email) {

		for (User user : getUsers()) {
			if (user.getEmail().equalsIgnoreCase(email)) {
				return false;
			}
		}
		return true;
	}

	public static User updateMyProfile(HashMap<String, String> data, String oldEmail) {
		try {
			ArrayList<User> users = getUsers();
			User updatedUser = new User();
			String email = (data.get("email"));
			if (!isUniqueEmail(email) && !email.equals(oldEmail)) {
				return null;
			}
			String firstName = data.get("firstName");
			String lastName = data.get("lastName");
			String pass = data.get("password");
			for (User user : users) {
				if (user.getEmail().equals(oldEmail)) {
					user.setEmail(email);
					user.setFirstName(firstName);
					user.setLastName(lastName);
					if (!pass.equals("")) {
						user.setPassword(pass);
					}
					updatedUser = user;
					break;
				}
			}

			mapper.writeValue(Paths.get(pathUsers).toFile(), users);

			return updatedUser;
		} catch (IOException e) {

			e.printStackTrace();
		}
		return null;
	}

	public static void organizationUpdated(String oldName, String newName) {
		List<User> users = getUsers();
		boolean changed = false;
		for (User user : users) {
			if (user.getOrganization().equals(oldName)) {
				user.setOrganization(newName);
				changed = true;
			}
		}
		if (changed) {
			try {
				mapper.writeValue(Paths.get(pathUsers).toFile(), users);

			} catch (IOException e) {

				e.printStackTrace();
			}
		}

	}

	public static boolean updateUser(HashMap<String, String> data) {
		ArrayList<User> users = getUsers();
		String email = data.get("email");
		String oldEmail = data.get("oldEmail");
		String firstName = data.get("firstName");
		String lastName = data.get("lastName");
		for (User user : users) {
			if (user.getEmail().equals(oldEmail)) {
				user.setEmail(email);
				user.setFirstName(firstName);
				user.setLastName(lastName);
				break;
			}
		}
		try {
			mapper.writeValue(Paths.get(pathUsers).toFile(), users);

			return true;
		} catch (IOException e) {

			e.printStackTrace();
		}
		return false;
	}

	public static List<User> getbyOrganization(String organization) {
		List<User> users = getUsers().stream().filter(user -> user.getOrganization().equals(organization))
				.collect(Collectors.toList());
		return users;
	}

	public static void organizationDeleted(String organizationName) {
		List<User> users = getUsers();
		users.removeIf(user -> user.getOrganization().equals(organizationName));
		try {
			mapper.writeValue(Paths.get(pathUsers).toFile(), users);

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

}
