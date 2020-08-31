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
import model.Role;
import model.User;
import model.VMcategory;

import repository.VmCategoryRepository;

@Path("vmcategories")
public class VmCategoryService {
	@Context
	HttpServletRequest request;
	
	User loggedUser;

	@POST
	@Path("/add")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response addVmCategory(HashMap<String, String> data) {
		
		loggedUser = (User) request.getSession().getAttribute("user");
		
		if (loggedUser == null || loggedUser.getRole().equals(Role.user)) {
			return Response.status(403).entity(HelperMethods.GetJsonValue("Unauthorized")).build();
		}

		boolean success = VmCategoryRepository.saveVmCategory(data);
		if (!success) {
			return Response.status(200).entity(HelperMethods.GetJsonValue("existError")).build();
		}
		return Response.status(200).entity(HelperMethods.GetJsonValue("success")).build();

	}

	@GET
	@Path("/getAll")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getVmCategories() {
		
		loggedUser = (User) request.getSession().getAttribute("user");
		
		if (loggedUser == null || !loggedUser.getRole().equals(Role.superadmin)) {
			return Response.status(403).entity(HelperMethods.GetJsonValue("Unauthorized")).build();
		}
		ArrayList<VMcategory> vMcategories = VmCategoryRepository.getVmCategories();

		return Response.status(200).entity(vMcategories).build();

	}

	@POST
	@Path("/delete")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteVirtualMachine(HashMap<String, String> data) {
		
		loggedUser = (User) request.getSession().getAttribute("user");
		
		if (loggedUser == null || loggedUser.getRole().equals(Role.user)) {
			return Response.status(403).entity(HelperMethods.GetJsonValue("Unauthorized")).build();
		}
		String name = data.get("name");
		if (VmCategoryRepository.deleteVmCategory(name)) {
			return Response.status(200).entity(VmCategoryRepository.getVmCategories()).build();
		}
		else {
			return Response.status(400).entity(HelperMethods.GetJsonValue("Failed to delete, virtual machines exist with selected category")).build();
		}

	}

	@GET
	@Path("/getAllNames")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getCategoriesNames() {
		
		loggedUser = (User) request.getSession().getAttribute("user");
		
		if (loggedUser == null) {
			return Response.status(403).entity(HelperMethods.GetJsonValue("Unauthorized")).build();
		}
		List<String> categories = VmCategoryRepository.getCategoriesNames();

		return Response.status(200).entity(categories).build();

	}

	@POST
	@Path("/getByName")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response getbyName(HashMap<String, String> data) {
		
		loggedUser = (User) request.getSession().getAttribute("user");
		
		if (loggedUser == null) {
			return Response.status(403).entity(HelperMethods.GetJsonValue("Unauthorized")).build();
		}
		
		VMcategory vMcategory = VmCategoryRepository.getCategoryByName(data.get("name"));
		if (vMcategory == null)
			return Response.status(400).entity(HelperMethods.GetJsonValue("Error getting category")).build();
		return Response.status(200).entity(vMcategory).build();

	}

	@POST
	@Path("/update")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateCategory(HashMap<String, String> data) {
		
		loggedUser = (User) request.getSession().getAttribute("user");
		
		if (loggedUser == null || loggedUser.getRole().equals(Role.user)) {
			return Response.status(403).entity(HelperMethods.GetJsonValue("Unauthorized")).build();
		}
		if (!data.get("oldName").equals(data.get("name"))
				&& !VmCategoryRepository.isUniqueVmCategory(data.get("name"))) {
			return Response.status(200).entity(HelperMethods.GetJsonValue("existError")).build();
		}
		boolean success = VmCategoryRepository.updateCategory(data);
		if (!success) {
			return Response.status(400).entity("Error updating category").build();
		}
		return Response.status(200).entity(HelperMethods.GetJsonValue(success)).build();

	}

}