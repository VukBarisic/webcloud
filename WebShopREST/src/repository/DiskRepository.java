package repository;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;

import model.Disk;
import model.DiskType;
import model.VirtualMachine;

public class DiskRepository {

	public static ObjectMapper mapper = new ObjectMapper();
	public static String pathDisks = "C:\\Users\\Vuk\\Desktop\\Faks\\5_semestar\\Web\\vezbe\\10-REST\\WebShopREST\\WebContent\\files\\disks.json";
	public static String pathVms = "C:\\Users\\Vuk\\Desktop\\Faks\\5_semestar\\Web\\vezbe\\10-REST\\WebShopREST\\WebContent\\files\\virtualmachines.json";

	public static ArrayList<Disk> getDisks() {

		try {

			ArrayList<Disk> disks = new ArrayList<Disk>(
					Arrays.asList(mapper.readValue(Paths.get(pathDisks).toFile(), Disk[].class)));

			return disks;

		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public static Disk findByName(String name) {
		for (Disk disk : getDisks()) {
			if (disk.getName().equals(name)) {
				return disk;
			}
		}
		return null;

	}

	public static boolean isUniqueDisk(String diskName) {

		for (Disk disk : getDisks()) {
			if (disk.getName().equalsIgnoreCase(diskName)) {
				return false;
			}
		}
		return true;
	}

	public static boolean saveDisk(HashMap<String, String> data) {
		try {
			ArrayList<VirtualMachine> virtualMachines = VmRepository.getVirtualMachines();
			ArrayList<Disk> disks = getDisks();
			int capacity = Integer.parseInt(data.get("capacity"));
			Disk disk = new Disk(data.get("name"), data.get("organization"), capacity, data.get("virtualMachine"));
			if (data.get("diskType").equals("HDD"))
				disk.setDiskType(DiskType.HDD);
			else
				disk.setDiskType(DiskType.SSD);
			disks.add(disk);

			if (!data.get("virtualMachine").equals("")) {
				for (VirtualMachine vm : virtualMachines) {
					if (vm.getName().equals(data.get("virtualMachine"))) {
						vm.getDisks().add(disk.getName());
						mapper.writeValue(Paths.get(pathVms).toFile(), virtualMachines);
					}
				}

			}

			mapper.writeValue(Paths.get(pathDisks).toFile(), disks);
			return true;
		} catch (IOException e) {

			e.printStackTrace();
			return false;
		}
	}

	public static boolean deleteDisk(String name) {
		try {
			ArrayList<Disk> disks = getDisks();
			for (Disk d : disks) {
				if (d.getName().equals(name)) {
					VmRepository.diskDeleted(d);
				}
			}
			disks.removeIf(disk -> disk.getName().equals(name));

			mapper.writeValue(Paths.get(pathDisks).toFile(), disks);
			return true;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;
	}

	public static List<Disk> searchDisks(String name, String organization) {
		List<Disk> disks = new ArrayList<>();
		if (organization == "") {
			disks = getDisks();
		} else {
			disks = getDisksByCompany(organization);
		}
		disks = disks.stream().filter(disk -> disk.getName().toLowerCase().contains(name.toLowerCase()))
				.collect(Collectors.toList());
		return disks;
	}

	public static boolean updateDisk(HashMap<String, String> data) {
		try {
			ArrayList<Disk> disks = getDisks();
			int capacity = Integer.parseInt(data.get("capacity"));
			for (Disk d : disks) {
				if (d.getName().equals(data.get("oldName"))) {
					d.setCapacity(capacity);
					d.setName(data.get("name"));
					d.setVirtualMachine(data.get("virtualMachine"));
					if (data.get("diskType").equals("HDD"))
						d.setDiskType(DiskType.HDD);
					else
						d.setDiskType(DiskType.SSD);
					VmRepository.diskUpdated(data.get("oldName"), d);

				}
			}

			mapper.writeValue(Paths.get(pathDisks).toFile(), disks);

			return true;
		} catch (IOException e) {

			e.printStackTrace();
			return false;
		}
	}

	public static List<Disk> filterDisks(HashMap<String, String> data, String organization) {
		List<Disk> disks = new ArrayList<>();
		if (organization == "") {
			disks = getDisks();
		} else {
			disks = getDisksByCompany(organization);
		}
		int capacityFrom = Integer.parseInt(data.get("capacityFrom"));
		int capacityTo = Integer.parseInt(data.get("capacityTo"));
		disks = disks.stream().filter(disk -> disk.getCapacity() > capacityFrom && disk.getCapacity() < capacityTo)
				.collect(Collectors.toList());

		return disks;
	}

	public static void organizationUpdated(String oldName, String newName) {
		List<Disk> disks = getDisks();
		boolean changed = false;
		for (Disk d : disks) {
			if (d.getOrganization().equals(oldName)) {
				d.setOrganization(newName);
				d.setVirtualMachine(d.getVirtualMachine().split("\\.")[0] + "." + newName);
				changed = true;
			}
		}
		if (changed) {
			try {
				mapper.writeValue(Paths.get(pathDisks).toFile(), disks);

			} catch (IOException e) {

				e.printStackTrace();
			}
		}

	}

	public static List<Disk> getDisksByCompany(String companyName) {
		List<Disk> disks = getDisks().stream().filter(disk -> disk.getOrganization().equals(companyName))
				.collect(Collectors.toList());
		return disks;
	}

	public static void vmUpdated(String oldName, String newName) {
		List<Disk> disks = getDisks();
		disks.stream().forEach(disk -> {
			if (disk.getVirtualMachine().equals(oldName)) {
				disk.setVirtualMachine(newName);
			}
		});
		try

		{
			mapper.writeValue(Paths.get(pathDisks).toFile(), disks);

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public static void vmDeleted(String name) {
		List<Disk> disks = getDisks();
		for (Disk d : disks) {
			if (d.getVirtualMachine().equals(name)) {
				d.setVirtualMachine("");
			}
		}
		try {
			mapper.writeValue(Paths.get(pathDisks).toFile(), disks);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	public static void organizationDeleted(String organizationName) {
		List<Disk> disks = getDisks();
		disks.removeIf(disk -> disk.getOrganization().equals(organizationName));
		try {
			mapper.writeValue(Paths.get(pathDisks).toFile(), disks);

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}

}
