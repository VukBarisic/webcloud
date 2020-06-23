package model;

public class Disk {

	// unique
	private String name;
	// mandatory
	private Organisation organisation;
	// mandatory
	private DiskType diskType;
	// mandatory
	private int capacity;
	// mandatory
	private VirtualMachine virtualMachine;

	public Disk(String name, Organisation organisation, DiskType diskType, int capacity,
			VirtualMachine virtualMachine) {
		this.name = name;
		this.organisation = organisation;
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

	public Organisation getOrganisation() {
		return organisation;
	}

	public void setOrganisation(Organisation organisation) {
		this.organisation = organisation;
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
