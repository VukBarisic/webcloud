package model;

import java.util.ArrayList;
import java.util.List;

public class VirtualMachine {
	// unique
	private String name;
	// mandatory
	private String organization;
	// mandatory
	private VMcategory vMcategory;
	private List<Activity> activities;
	private List<String> disks;

	public VirtualMachine() {

	}

	public VirtualMachine(String name, String organization, VMcategory vMcategory) {
		this.name = name;
		this.organization = organization;
		this.vMcategory = vMcategory;
		this.activities = new ArrayList<Activity>();
		this.disks = new ArrayList<String>();
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getOrganization() {
		return organization;
	}

	public void setOrganization(String organization) {
		this.organization = organization;
	}

	public VMcategory getvMcategory() {
		return vMcategory;
	}

	public void setvMcategory(VMcategory vMcategory) {
		this.vMcategory = vMcategory;
	}

	public List<String> getDisks() {
		return disks;
	}

	public void setDisks(List<String> disks) {
		this.disks = disks;
	}
	public List<Activity> getActivities() {
		return activities;
	}

	public void setActivities(List<Activity> activities) {
		this.activities = activities;
	}


}
