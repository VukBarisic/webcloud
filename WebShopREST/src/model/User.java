package model;

public class User {
	//unique
	private String email;
	private String password;
	private String firstName;
	private String lastName;
	private String organisation;
	private Role role;
	
	public User() {
	}

	public User(String email, String password, String firstName, String lastName, String organisation, String role) {
		this.email = email;
		this.password = password;
		this.firstName = firstName;
		this.lastName = lastName;
		this.organisation = organisation;
		if (role.equals("superadmin")) this.role = Role.superadmin;
		else if (role.equals("admin")) this.role = Role.admin;
		else if (role.equals("user")) this.role = Role.user;
	}
	
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}


	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getOrganisation() {
		return organisation;
	}

	public void setOrganisation(String organisation) {
		this.organisation = organisation;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}
	
	
	
	
	
	
	


}
