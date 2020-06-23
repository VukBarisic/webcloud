package model;

import java.util.List;

public class Organisation {

//unique
	private String name;
	private String description;
	private String logo;
	private List<User> users;
	private List<String> resources;

	public Organisation() {
	}

	public Organisation(String name, String description, String logo, List<User> users, List<String> resources) {
		super();
		this.name = name;
		this.description = description;
		this.logo = logo;
		this.users = users;
		this.resources = resources;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getLogo() {
		return logo;
	}

	public void setLogo(String logo) {
		this.logo = logo;
	}

	public List<User> getUsers() {
		return users;
	}

	public void setUsers(List<User> users) {
		this.users = users;
	}

	public List<String> getResources() {
		return resources;
	}

	public void setResources(List<String> resources) {
		this.resources = resources;
	}

}
