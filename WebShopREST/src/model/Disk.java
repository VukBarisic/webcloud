package model;

public class Disk {

	// unique
	private String name;
	// mandatory
	private String organization;
	// mandatory
	private DiskType diskType;
	// mandatory
	private int capacity;
	// mandatory
	private String virtualMachine;
	
	

	public Disk() {
	}

	public Disk(String name, String organization, DiskType diskType, int capacity, String virtualMachine) {
		this.name = name;
		this.organization = organization;
		this.diskType = diskType;
		this.capacity = capacity;
		this.virtualMachine = virtualMachine;
	}

	public Disk(String name, String organization, int capacity, String virtualMachine) {
		this.name = name;
		this.organization = organization;
		this.capacity = capacity;
		this.virtualMachine = virtualMachine;
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

	public DiskType getDiskType() {
		return diskType;
	}

	public void setDiskType(DiskType diskType) {
		this.diskType = diskType;
	}

	public int getCapacity() {
		return capacity;
	}

	public void setCapacity(int capacity) {
		this.capacity = capacity;
	}

	public String getVirtualMachine() {
		return virtualMachine;
	}

	public void setVirtualMachine(String virtualMachine) {
		this.virtualMachine = virtualMachine;
	}

}
