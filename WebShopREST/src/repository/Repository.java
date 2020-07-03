package repository;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.org.apache.xpath.internal.operations.Or;

import model.Organization;
import model.User;

public class Repository {

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

	public static ArrayList<Organization> getOrganizations() {

		try {

			ArrayList<Organization> organizations = new ArrayList<Organization>(Arrays.asList(mapper.readValue(Paths
					.get("C:\\Users\\Vuk\\Desktop\\Faks\\5_semestar\\Web\\vezbe\\10-REST\\WebShopREST\\WebContent\\files\\organizations.json")
					.toFile(), Organization[].class)));

			return organizations;

		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public static boolean isUniqueOrg(String OrgName) {

		for (Organization org : getOrganizations()) {
			if (org.getName().equalsIgnoreCase(OrgName)) {
				return false;
			}
		}
		return true;
	}

	public static String saveOrganization(String name, String description) {
		try {
			ArrayList<Organization> organizations = getOrganizations();
			Organization organization = new Organization(name, description,name.replaceAll("\\s","") + ".jpg");
			String json = mapper.writeValueAsString(organization);
			organizations.add(organization);
			mapper.writeValue(Paths.get(
					"C:\\Users\\Vuk\\Desktop\\Faks\\5_semestar\\Web\\vezbe\\10-REST\\WebShopREST\\WebContent\\files\\organizations.json")
					.toFile(), organizations);
			return json;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	public static boolean deleteOrganization(String name) {
		try {
			ArrayList<Organization> organizations = getOrganizations();
			organizations.removeIf(organization -> organization.getName().equals(name));
			mapper.writeValue(Paths.get(
					"C:\\Users\\Vuk\\Desktop\\Faks\\5_semestar\\Web\\vezbe\\10-REST\\WebShopREST\\WebContent\\files\\organizations.json")
					.toFile(), organizations);
			return true;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;
	}

	public static List<Organization> searchOrganizations(String name) {
		List<Organization> organizations = getOrganizations().stream().filter(organization -> organization.getName().toLowerCase().contains(name.toLowerCase())).collect(Collectors.toList());
		return organizations;
	}	

}
