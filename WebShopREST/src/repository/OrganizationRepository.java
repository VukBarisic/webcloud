package repository;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;

import model.Organization;

public class OrganizationRepository {

	public static ObjectMapper mapper = new ObjectMapper();

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

	public static Organization findByName(String name) {
		for (Organization organization : getOrganizations()) {
			if (organization.getName().equals(name)) {
				return organization;
			}
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
			Organization organization = new Organization(name, description, name.replaceAll("\\s", "") + ".jpg");
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
			Path imagePath = Paths.get(
					"C:\\Users\\Vuk\\Desktop\\Faks\\5_semestar\\Web\\vezbe\\10-REST\\WebShopREST\\WebContent\\imgs\\"
							+ name.replaceAll("\\s", "") + ".jpg");

			Files.delete(imagePath);
			return true;

		} catch (

		IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;
	}

	public static List<Organization> searchOrganizations(String name) {
		List<Organization> organizations = getOrganizations().stream()
				.filter(organization -> organization.getName().toLowerCase().contains(name.toLowerCase()))
				.collect(Collectors.toList());
		return organizations;
	}

	public static List<String> getOrganizationsNames() {
		List<String> organizationsNames = new ArrayList<>();
		for (Organization org : getOrganizations()) {
			organizationsNames.add(org.getName());
		}
		return organizationsNames;
	}

	public static void vmUpdated(String oldName, String newName) {
		List<Organization> organizations = getOrganizations();
		for (Organization org : organizations) {
			List<String> resources = org.getResources().stream().map(r -> r.equals(oldName) ? newName : r)
					.collect(Collectors.toList());
			org.setResources(resources);
		}
		try

		{
			mapper.writeValue(Paths.get(
					"C:\\Users\\Vuk\\Desktop\\Faks\\5_semestar\\Web\\vezbe\\10-REST\\WebShopREST\\WebContent\\files\\organizations.json")
					.toFile(), organizations);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public static boolean updateOrganization(HashMap<String, String> data) {
		try {
			ArrayList<Organization> organizations = getOrganizations();
			for (Organization org : organizations) {
				if (org.getName().equals(data.get("oldName"))) {
					org.setName(data.get("name"));
					org.setDescription(data.get("description"));
					org.setLogo(org.getName().replaceAll("\\s", "") + ".jpg");
					if (!data.get("oldName").replaceAll("\\s", "").equals(data.get("name").replaceAll("\\s", ""))) {
						VmRepository.organizationUpdated(data.get("oldName"), data.get("name"));
						UserRepository.organizationUpdated(data.get("oldName"), data.get("name"));
						DiskRepository.organizationUpdated(data.get("oldName"), data.get("name"));
						if (data.get("logo").equals("")) {
							File file = new File(
									"C:\\Users\\Vuk\\Desktop\\Faks\\5_semestar\\Web\\vezbe\\10-REST\\WebShopREST\\WebContent\\imgs\\"
											+ data.get("oldName").replaceAll("\\s", "") + ".jpg");
							// File (or directory) with new name
							File file2 = new File(
									"C:\\Users\\Vuk\\Desktop\\Faks\\5_semestar\\Web\\vezbe\\10-REST\\WebShopREST\\WebContent\\imgs\\"
											+ org.getLogo());

							if (file2.exists())
								throw new java.io.IOException("file exists");

							boolean success = file.renameTo(file2);

							if (!success) {
								return false;
							}

						}

					}
					if (!data.get("logo").equals("")) {
						Path imagePath = Paths.get(
								"C:\\Users\\Vuk\\Desktop\\Faks\\5_semestar\\Web\\vezbe\\10-REST\\WebShopREST\\WebContent\\imgs\\"
										+ data.get("oldName").replaceAll("\\s", "") + ".jpg");
						try {
							Files.delete(imagePath);
						} catch (IOException e) {
							e.printStackTrace();
						}
					}
					break;
				}
			}

			mapper.writeValue(Paths.get(
					"C:\\Users\\Vuk\\Desktop\\Faks\\5_semestar\\Web\\vezbe\\10-REST\\WebShopREST\\WebContent\\files\\organizations.json")
					.toFile(), organizations);
			return true;
		} catch (IOException e) {

			e.printStackTrace();
			return false;
		}
	}
}