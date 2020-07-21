package services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import helpers.HelperMethods;
import model.Organization;
import model.VMcategory;
import model.VirtualMachine;
import repository.OrganizationRepository;
import repository.VmCategoryRepository;
import repository.VmRepository;


@Path("vmcategories")
public class VmCategoryService {
	@Context
	HttpServletRequest request;

	@POST
	@Path("/add")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response addVmCategory(HashMap<String, String> data) {

		boolean success = VmCategoryRepository.saveVmCategory(data);
		if (!success) {
			return Response.status(400).entity(HelperMethods.GetJsonValue("Vm category name already exists")).build();
		}
		return Response.status(200).entity(HelperMethods.GetJsonValue("success")).build();

	}

	@GET
	@Path("/getAll")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getVmCategories() {
		ArrayList<VMcategory> vMcategories = VmCategoryRepository.getVmCategories();

		return Response.status(200).entity(vMcategories).build();

	}

	@POST
	@Path("/delete")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteVirtualMachine(HashMap<String, String> data) {
		String name = data.get("name");
		if (VmCategoryRepository.deleteVmCategory(name)) {
			return Response.status(200).entity(VmCategoryRepository.getVmCategories()).build();
		}

		return Response.status(400).entity(HelperMethods.GetJsonValue("Error deleting")).build();
	}
	
	@GET
	@Path("/getAllNames")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getCategoriesNames() {
		List<String> categories = VmCategoryRepository.getCategoriesNames();

		return Response.status(200).entity(categories).build();

	}
	
	@POST
	@Path("/getByName")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response getbyName(HashMap<String, String> data) {
		VMcategory vMcategory = VmCategoryRepository.getCategoryByName(data.get("categoryName"));
		if (vMcategory == null) return Response.status(400).entity("Error getting category").build();
		return Response.status(200).entity(vMcategory).build();

	}
	
}