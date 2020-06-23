package model;

public class VMcategory {

	// unique
	private String name;
	// mandatory > 0
	private int numberOfCores;
	// mandatory > 0 in gb
	private int ram;
	private int numOfGpuCores;

	public VMcategory() {
	}

	public VMcategory(String name, int numberOfCores, int ram, int numOfGpuCores) {
		super();
		this.name = name;
		this.numberOfCores = numberOfCores;
		this.ram = ram;
		this.numOfGpuCores = numOfGpuCores;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getNumberOfCores() {
		return numberOfCores;
	}

	public void setNumberOfCores(int numberOfCores) {
		this.numberOfCores = numberOfCores;
	}

	public int getRam() {
		return ram;
	}

	public void setRam(int ram) {
		this.ram = ram;
	}

	public int getNumOfGpuCores() {
		return numOfGpuCores;
	}

	public void setNumOfGpuCores(int numOfGpuCores) {
		this.numOfGpuCores = numOfGpuCores;
	}

}
