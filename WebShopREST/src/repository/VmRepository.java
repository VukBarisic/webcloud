package repository;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.java_cup.internal.runtime.virtual_parse_stack;

import model.Disk;
import model.Organization;
import model.VMcategory;
import model.VirtualMachine;

public class VmRepository {

	public static ObjectMapper mapper = new ObjectMapper();

	public static ArrayList<VirtualMachine> getVirtualMachines() {
		try {

			ArrayList<VirtualMachine> virtualMachines = new ArrayList<VirtualMachine>(
					Arrays.asList(mapper.readValue(Paths.get(
							"C:\\Users\\Vuk\\Desktop\\Faks\\5_semestar\\Web\\vezbe\\10-REST\\WebShopREST\\WebContent\\files\\virtualmachines.json")
							.toFile(), VirtualMachine[].class)));

			return virtualMachines;

		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public static List<VirtualMachine> getVirtualMachinesByCompany(String companyName) {
		List<VirtualMachine> virtualMachines = getVirtualMachines().stream()
				.filter(virtualMachine -> virtualMachine.getOrganization().equals(companyName))
				.collect(Collectors.toList());
		return virtualMachines;
	}

	public static boolean deleteVirtualMachine(String name) {
		try {
			ArrayList<VirtualMachine> virtualMachines = getVirtualMachines();
			ArrayList<Organization> organizations = OrganizationRepository.getOrganizations();
			virtualMachines.removeIf(virtualMachine -> virtualMachine.getName().equals(name));

			for (Organization org : organizations) {
				org.getResources().removeIf(resource -> resource.equals(name));
			}

			mapper.writeValue(Paths.get(
					"C:\\Users\\Vuk\\Desktop\\Faks\\5_semestar\\Web\\vezbe\\10-REST\\WebShopREST\\WebContent\\files\\virtualmachines.json")
					.toFile(), virtualMachines);

			mapper.writeValue(Paths.get(
					"C:\\Users\\Vuk\\Desktop\\Faks\\5_semestar\\Web\\vezbe\\10-REST\\WebShopREST\\WebContent\\files\\organizations.json")
					.toFile(), organizations);
			return true;
		} catch (IOException e) {
			e.printStackTrace();
		}
		return false;
	}

	public static boolean saveVirtualMachine(HashMap<String, String> data) {
		try {

			VMcategory vMcategory = VmCategoryRepository.findByName(data.get("category"));
			if (vMcategory == null)
				return false;
			Organization organization = OrganizationRepository.findByName(data.get("organization"));
			if (organization == null)
				return false;
			VirtualMachine virtualMachine = new VirtualMachine(data.get("name") + "." + data.get("organization"),
					data.get("organization"), vMcategory);
			ArrayList<Organization> organizations = OrganizationRepository.getOrganizations();
			for (Organization org : organizations) {
				if (org.getName().equals(data.get("organization"))) {
					org.getResources().add(virtualMachine.getName());
				}
			}
			ArrayList<VirtualMachine> virtualMachines = getVirtualMachines();
			virtualMachines.add(virtualMachine);

			mapper.writeValue(Paths.get(
					"C:\\Users\\Vuk\\Desktop\\Faks\\5_semestar\\Web\\vezbe\\10-REST\\WebShopREST\\WebContent\\files\\organizations.json")
					.toFile(), organizations);
			mapper.writeValue(Paths.get(
					"C:\\Users\\Vuk\\Desktop\\Faks\\5_semestar\\Web\\vezbe\\10-REST\\WebShopREST\\WebContent\\files\\virtualmachines.json")
					.toFile(), virtualMachines);
			return true;
		} catch (IOException e) {

			e.printStackTrace();
			return false;
		}
	}

	public static boolean isUniqueVm(String vmName) {

		for (VirtualMachine vm : getVirtualMachines()) {
			if (vm.getName().equalsIgnoreCase(vmName)) {
				return false;
			}
		}
		return true;
	}

	public static List<VirtualMachine> searchVirtualMachines(String name) {
		List<VirtualMachine> virtualMachines = getVirtualMachines().stream()
				.filter(vm -> vm.getName().toLowerCase().contains(name.toLowerCase()))
				.collect(Collectors.toList());
		return virtualMachines;
	}

	public static VirtualMachine findByName(String name) {
		for (VirtualMachine vm : getVirtualMachines()) {
			if (vm.getName().equals(name)) {
				return vm;
			}
		}
		return null;
	}

	public static List<String> getVmNamesByCompany(String companyName) {
		List<String> vmNames = new ArrayList<>();
		for (VirtualMachine vm : getVirtualMachinesByCompany(companyName)) {
			vmNames.add(vm.getName());
		}
		return vmNames;
	}

	public static void diskUpdated(String oldName, Disk disk) {
		List<VirtualMachine> virtualMachines = getVirtualMachines();
		if (!disk.getName().equals(oldName)) {
			for (VirtualMachine vm : virtualMachines) {
				if (vm.getDisks().contains(oldName)) {
					List<String> disks = vm.getDisks().stream().map(d -> d.equals(oldName) ? disk.getName() : oldName)
							.collect(Collectors.toList());
					vm.setDisks(disks);
					break;
				}
			}
		}
		for (VirtualMachine vm : virtualMachines) {
			if (vm.getDisks().contains(disk.getName()) && !vm.getName().equals(disk.getVirtualMachine())) {
				vm.getDisks().removeIf(diskName -> diskName.equals(disk.getName()));
			}
			if (vm.getName().equals(disk.getVirtualMachine()) && !vm.getDisks().contains(disk.getName())) {
				vm.getDisks().add(disk.getName());
			}

		}

		try {
			mapper.writeValue(Paths.get(
					"C:\\Users\\Vuk\\Desktop\\Faks\\5_semestar\\Web\\vezbe\\10-REST\\WebShopREST\\WebContent\\files\\virtualmachines.json")
					.toFile(), virtualMachines);
		} catch (IOException e) {

			e.printStackTrace();
		}
	}

	public static List<VirtualMachine> filterVirtualMachines(HashMap<String, String> data) {
		List<VirtualMachine> virtualMachines = getVirtualMachines();
		if (!data.get("ramFrom").equals("")) {
			int ramFrom = Integer.parseInt(data.get("ramFrom"));
			int ramTo = Integer.parseInt(data.get("ramTo"));
			virtualMachines = virtualMachines.stream().filter(vm-> vm.getvMcategory().getRam() > ramFrom && vm.getvMcategory().getRam() < ramTo).collect(Collectors.toList());
		}
		if (!data.get("gpuFrom").equals("")) {
			int gpuFrom = Integer.parseInt(data.get("gpuFrom"));
			int gpuTo = Integer.parseInt(data.get("gpuTo"));
			virtualMachines = virtualMachines.stream().filter(vm-> vm.getvMcategory().getNumOfGpuCores() > gpuFrom && vm.getvMcategory().getNumOfGpuCores() < gpuTo).collect(Collectors.toList());
		}
		if (!data.get("coresFrom").equals("")) {
			int coresFrom = Integer.parseInt(data.get("coresFrom"));
			int coresTo = Integer.parseInt(data.get("coresTo"));
			virtualMachines = virtualMachines.stream().filter(vm-> vm.getvMcategory().getNumberOfCores() > coresFrom && vm.getvMcategory().getNumberOfCores() < coresTo).collect(Collectors.toList());
		}
		
		return virtualMachines;
	}
}
