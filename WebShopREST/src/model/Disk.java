package model;

public class Disk {

	// unique
	private String name;
	// mandatory
	private Organization organization;
	// mandatory
	private DiskType diskType;
	// mandatory
	private int capacity;
	// mandatory
	private VirtualMachine virtualMachine;

	public Disk(String name, Organization organization, DiskType diskType, int capacity,
			VirtualMachine virtualMachine) {
		this.name = name;
		this.organization = organization;
		this.diskType = diskType;
		this.capacity = capacity;
		this.virtualMachine = virtualMachine;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Organization getOrganisation() {
		return organization;
	}

	public void setOrganisation(Organization organization) {
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

	public VirtualMachine getVirtualMachine() {
		return virtualMachine;
	}

	public void setVirtualMachine(VirtualMachine virtualMachine) {
		this.virtualMachine = virtualMachine;
	}

}
