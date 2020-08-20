package services;

import java.util.ArrayList;

import java.util.HashMap;

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
import model.Disk;
import model.Role;
import model.User;
import repository.DiskRepository;


@Path("/disks")
public class DiskService {

	@Context
	HttpServletRequest request;

	User loggedUser;
	
	@POST
	@Path("/add")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response addDisk(HashMap<String, String> data) {
		
		loggedUser = (User) request.getSession().getAttribute("user");
		
		if (loggedUser == null || loggedUser.getRole().equals(Role.user)) {
			return Response.status(403).entity(HelperMethods.GetJsonValue("Unauthorized")).build();
		}
		if (!DiskRepository.isUniqueDisk(data.get("name"))) {
			return Response.status(200).entity(HelperMethods.GetJsonValue("existError")).build();
		}
		boolean success = DiskRepository.saveDisk(data);
		if (!success) {
			return Response.status(400).entity("Error adding disk").build();
		}
		return Response.status(200).entity(HelperMethods.GetJsonValue("success")).build();

	}

	@GET
	@Path("/getAll")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getDisks() {
		loggedUser = (User) request.getSession().getAttribute("user");
		
		if (loggedUser == null || !loggedUser.getRole().equals(Role.superadmin)) {
			return Response.status(403).entity(HelperMethods.GetJsonValue("Unauthorized")).build();
		}
		ArrayList<Disk> disks = DiskRepository.getDisks();

		return Response.status(200).entity(HelperMethods.GetJsonValue(disks)).build();

	}

	@POST
	@Path("/delete")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response delete(HashMap<String, String> data) {
		
		loggedUser = (User) request.getSession().getAttribute("user");
		
		if (loggedUser == null || loggedUser.getRole().equals(Role.user)) {
			return Response.status(403).entity(HelperMethods.GetJsonValue("Unauthorized")).build();
		}
		
		String name = data.get("name");
		if (DiskRepository.deleteDisk(name)) {
			return Response.status(200).entity(DiskRepository.getDisks()).build();
		}

		return Response.status(400).entity(HelperMethods.GetJsonValue("error")).build();
	}

	@POST
	@Path("/search")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response searchDisks(HashMap<String, String> data) {
		loggedUser = (User) request.getSession().getAttribute("user");
		
		if (loggedUser == null) {
			return Response.status(403).entity(HelperMethods.GetJsonValue("Unauthorized")).build();
		}
		String name = data.get("name");
		return Response.status(200).entity(DiskRepository.searchDisks(name, loggedUser.getOrganization())).build();

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
		Disk disk = DiskRepository.findByName(data.get("name"));
		if (disk == null)
			return Response.status(400).entity(HelperMethods.GetJsonValue("Error getting disk")).build();
		return Response.status(200).entity(disk).build();

	}
	
	@POST
	@Path("/update")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateDisk(HashMap<String, String> data) {
		loggedUser = (User) request.getSession().getAttribute("user");
		
		if (loggedUser == null || loggedUser.getRole().equals(Role.user)) {
			return Response.status(403).entity(HelperMethods.GetJsonValue("Unauthorized")).build();
		}
		if (!data.get("oldName").equals(data.get("name")) && !DiskRepository.isUniqueDisk(data.get("name"))) {
			return Response.status(200).entity(HelperMethods.GetJsonValue("existError")).build();
		}
		boolean success = DiskRepository.updateDisk(data);
		if (!success) {
			return Response.status(400).entity("Error updating disk").build();
		}
		return Response.status(200).entity(HelperMethods.GetJsonValue(success)).build();

	}
	
	@POST
	@Path("/filter")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response filterDisks(HashMap<String, String> data) {
		loggedUser = (User) request.getSession().getAttribute("user");
		
		if (loggedUser == null || !loggedUser.getRole().equals(Role.superadmin)) {
			return Response.status(403).entity(HelperMethods.GetJsonValue("Unauthorized")).build();
		}
		return Response.status(200).entity(DiskRepository.filterDisks(data, loggedUser.getOrganization())).build();
	}
	
	@GET
	@Path("/getByOrganization")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getbyOrganization(HashMap<String, String> data) {
		
		loggedUser = (User) request.getSession().getAttribute("user");
		
		if (loggedUser == null || loggedUser.getRole().equals(Role.superadmin)) {
			return Response.status(403).entity(HelperMethods.GetJsonValue("Unauthorized")).build();
		}


		return Response.status(200).entity(DiskRepository.getDisksByCompany(loggedUser.getOrganization())).build();

	}
	
	
}
