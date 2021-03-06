package repository;

import java.io.IOException;

import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import model.VMcategory;
import model.VirtualMachine;

public class VmCategoryRepository {

	public static ObjectMapper mapper = new ObjectMapper();
	public static String pathVmCategories = "C:\\Users\\Vuk\\Desktop\\Faks\\5_semestar\\Web\\vezbe\\10-REST\\WebShopREST\\WebContent\\files\\vmcategories.json";

	public static ArrayList<VMcategory> getVmCategories() {
		try {

			ArrayList<VMcategory> vMcategories = new ArrayList<VMcategory>(
					Arrays.asList(mapper.readValue(Paths.get(pathVmCategories).toFile(), VMcategory[].class)));

			return vMcategories;

		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public static boolean deleteVmCategory(String name) {
		try {
			ArrayList<VMcategory> vMcategories = getVmCategories();
			ArrayList<VirtualMachine> virtualMachines = VmRepository.getVirtualMachines();
			for (VirtualMachine vm : virtualMachines) {
				if (vm.getvMcategory().getName().equals(name)) {
					return false;
				}
			}
			vMcategories.removeIf(vmCategory -> vmCategory.getName().equals(name));
			mapper.writeValue(Paths.get(pathVmCategories).toFile(), vMcategories);
			return true;
		} catch (IOException e) {
			e.printStackTrace();
		}
		return false;
	}

	public static boolean saveVmCategory(HashMap<String, String> data) {
		try {
			int numOfCores = Integer.parseInt(data.get("numOfCores"));
			int ram = Integer.parseInt(data.get("ram"));
			int numOfGpuCores = Integer.parseInt(data.get("numOfGpuCores"));
			if (!isUniqueVmCategory(data.get("name"))) {
				return false;
			}
			VMcategory vMcategory = new VMcategory(data.get("name"), numOfCores, ram, numOfGpuCores);
			ArrayList<VMcategory> vMcategories = getVmCategories();
			vMcategories.add(vMcategory);

			mapper.writeValue(Paths.get(pathVmCategories).toFile(), vMcategories);
			return true;
		} catch (IOException e) {

			e.printStackTrace();
			return false;
		}
	}

	public static boolean isUniqueVmCategory(String categoryName) {

		for (VMcategory cat : getVmCategories()) {
			if (cat.getName().equalsIgnoreCase(categoryName)) {
				return false;
			}
		}
		return true;
	}

	public static List<String> getCategoriesNames() {
		List<String> categoriesNames = new ArrayList<>();
		for (VMcategory cat : getVmCategories()) {
			categoriesNames.add(cat.getName());
		}
		return categoriesNames;

	}

	public static VMcategory getCategoryByName(String categoryName) {
		for (VMcategory cat : getVmCategories()) {
			if (cat.getName().equals(categoryName)) {
				return cat;
			}
		}
		return null;
	}

	public static VMcategory findByName(String name) {
		for (VMcategory vMcategory : getVmCategories()) {
			if (vMcategory.getName().equals(name)) {
				return vMcategory;
			}
		}
		return null;

	}

	public static boolean updateCategory(HashMap<String, String> data) {
		try {
			ArrayList<VMcategory> categories = getVmCategories();
			int ram = Integer.parseInt(data.get("ram"));
			int gpu = Integer.parseInt(data.get("gpu"));
			int cores = Integer.parseInt(data.get("cores"));
			for (VMcategory c : categories) {
				if (c.getName().equals(data.get("oldName"))) {
					c.setRam(ram);
					c.setNumberOfCores(cores);
					c.setNumOfGpuCores(gpu);
					c.setName(data.get("name"));
					VmRepository.categoryUpdated(c, data.get("name"));
				}
			}

			mapper.writeValue(Paths.get(pathVmCategories)
					.toFile(), categories);
			return true;
		} catch (IOException e) {

			e.printStackTrace();
			return false;
		}
	}

}
