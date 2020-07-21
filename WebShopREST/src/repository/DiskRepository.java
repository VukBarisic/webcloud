package repository;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.GeneratedValue;

import com.fasterxml.jackson.databind.ObjectMapper;

import model.Disk;
import model.DiskType;
import model.Organization;
import model.VMcategory;
import model.VirtualMachine;

public class DiskRepository {

	public static ObjectMapper mapper = new ObjectMapper();

	public static ArrayList<Disk> getDisks() {

		try {

			ArrayList<Disk> disks = new ArrayList<Disk>(Arrays.asList(mapper.readValue(Paths.get(
					"C:\\Users\\Vuk\\Desktop\\Faks\\5_semestar\\Web\\vezbe\\10-REST\\WebShopREST\\WebContent\\files\\disks.json")
					.toFile(), Disk[].class)));

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
			ArrayList<Organization> organizations = OrganizationRepository.getOrganizations();
			int capacity = Integer.parseInt(data.get("capacity"));
			Disk disk = new Disk(data.get("name"), data.get("organization"), capacity, data.get("virtualMachine"));
			if (data.get("diskType").equals("HDD"))
				disk.setDiskType(DiskType.HDD);
			else
				disk.setDiskType(DiskType.SSD);
			disks.add(disk);

			if (!data.get("virtualMachine").equals("")) {
				for (VirtualMachine vm : virtualMachines) {
					if (vm.getName().split("\\.")[0].equals(data.get("virtualMachine"))) {
						vm.getDisks().add(disk);
						mapper.writeValue(Paths.get(
								"C:\\Users\\Vuk\\Desktop\\Faks\\5_semestar\\Web\\vezbe\\10-REST\\WebShopREST\\WebContent\\files\\virtualmachines.json")
								.toFile(), virtualMachines);
					}
				}
				for (Organization org : organizations) {
					if (org.getName().equals(data.get("organization"))) {
						for (VirtualMachine vm : org.getResources()) {
							if (vm.getName().split("\\.")[0].equals(data.get("virtualMachine"))) {
								vm.getDisks().add(disk);
								mapper.writeValue(Paths.get(
										"C:\\Users\\Vuk\\Desktop\\Faks\\5_semestar\\Web\\vezbe\\10-REST\\WebShopREST\\WebContent\\files\\organizations.json")
										.toFile(), organizations);
								break;
							}

						}
					}
					break;
				}

			}

			mapper.writeValue(Paths.get(
					"C:\\Users\\Vuk\\Desktop\\Faks\\5_semestar\\Web\\vezbe\\10-REST\\WebShopREST\\WebContent\\files\\disks.json")
					.toFile(), disks);
			return true;
		} catch (IOException e) {

			e.printStackTrace();
			return false;
		}
	}

	public static boolean deleteDisk(String name) {
		try {
			ArrayList<Disk> disks = getDisks();
			disks.removeIf(disk -> disk.getName().equals(name));
			mapper.writeValue(Paths.get(
					"C:\\Users\\Vuk\\Desktop\\Faks\\5_semestar\\Web\\vezbe\\10-REST\\WebShopREST\\WebContent\\files\\disks.json")
					.toFile(), disks);
			return true;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;
	}

	public static List<Disk> searchDisks(String name) {
		List<Disk> disks = getDisks().stream().filter(disk -> disk.getName().toLowerCase().contains(name.toLowerCase()))
				.collect(Collectors.toList());
		return disks;
	}

}
