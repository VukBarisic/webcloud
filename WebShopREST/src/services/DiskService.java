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
import repository.DiskRepository;


@Path("/disks")
public class DiskService {

	@Context
	HttpServletRequest request;

	@POST
	@Path("/add")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response addDisk(HashMap<String, String> data) {
		if (!DiskRepository.isUniqueDisk(data.get("name"))) {
			return Response.status(200).entity("existError").build();
		}
		boolean success = DiskRepository.saveDisk(data);
		if (!success) {
			return Response.status(400).entity("Error adding disk").build();
		}
		return Response.status(200).entity(HelperMethods.GetJsonValue(success)).build();

	}

	@GET
	@Path("/getAll")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getDisks() {
		ArrayList<Disk> disks = DiskRepository.getDisks();

		return Response.status(200).entity(disks).build();

	}

	@POST
	@Path("/delete")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response delete(HashMap<String, String> data) {
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
		String name = data.get("name");
		return Response.status(200).entity(DiskRepository.searchDisks(name)).build();

	}

	@POST
	@Path("/getByName")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response getbyName(HashMap<String, String> data) {
		Disk disk = DiskRepository.findByName(data.get("name"));
		if (disk == null)
			return Response.status(400).entity("Error getting disk").build();
		return Response.status(200).entity(disk).build();

	}
	
	@POST
	@Path("/update")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateDisk(HashMap<String, String> data) {
		if (!data.get("oldName").equals(data.get("name")) && !DiskRepository.isUniqueDisk(data.get("name"))) {
			return Response.status(200).entity("existError").build();
		}
		boolean success = DiskRepository.updateDisk(data);
		if (!success) {
			return Response.status(400).entity("Error updating disk").build();
		}
		return Response.status(200).entity(HelperMethods.GetJsonValue(success)).build();

	}
}
