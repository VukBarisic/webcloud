package model;

import java.util.ArrayList;
import java.util.List;

public class Organization {

//unique
	private String name;
	private String description;
	private String logo;
	private List<String> users;
	private List<String> resources;

	public Organization() {
	}

	public Organization(String name, String description, String logo, List<String> users, List<String> resources) {
		super();
		this.name = name;
		this.description = description;
		this.logo = logo;
		this.users = users;
		this.resources = resources;
	}

	public Organization(String name, String description, String logo) {
		this.name = name;
		this.description = description;
		this.logo = logo;
		this.users = new ArrayList<String>();
		this.resources = new ArrayList<String>();
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

	public List<String> getUsers() {
		return users;
	}

	public void setUsers(List<String> users) {
		this.users = users;
	}

	public List<String> getResources() {
		return resources;
	}

	public void setResources(List<String> resources) {
		this.resources = resources;
	}

}
