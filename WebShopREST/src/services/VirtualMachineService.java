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
import model.Role;
import model.User;
import model.VirtualMachine;
import repository.VmRepository;

@Path("vms")
public class VirtualMachineService {

	@Context
	HttpServletRequest request;
	
	User loggedUser;

	@POST
	@Path("/add")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response addVirtualMachine(HashMap<String, String> data) {
		
		loggedUser = (User) request.getSession().getAttribute("user");
		
		if (loggedUser == null || loggedUser.getRole().equals(Role.superadmin)) {
			return Response.status(403).entity(HelperMethods.GetJsonValue("Unauthorized")).build();
		}

		if (!VmRepository.isUniqueVm(data.get("name") + "_" + data.get("organization"))) {
			return Response.status(200).entity(HelperMethods.GetJsonValue("existError")).build();
		}
		boolean success = VmRepository.saveVirtualMachine(data);
		if (!success) {
			return Response.status(400).entity(HelperMethods.GetJsonValue("Bad Request")).build();
		}
		return Response.status(200).entity(HelperMethods.GetJsonValue("success")).build();

	}

	@GET
	@Path("/getAll")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getVirtualMachines() {
		
		loggedUser = (User) request.getSession().getAttribute("user");
		
		if (loggedUser == null || !loggedUser.getRole().equals(Role.superadmin)) {
			return Response.status(403).entity(HelperMethods.GetJsonValue("Unauthorized")).build();
		}
		ArrayList<VirtualMachine> virtualMachines = VmRepository.getVirtualMachines();

		return Response.status(200).entity(virtualMachines).build();

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
		if (VmRepository.deleteVirtualMachine(name)) {
			return Response.status(200).entity(VmRepository.getVirtualMachines()).build();
		}

		return Response.status(400).entity(HelperMethods.GetJsonValue("error")).build();
	}

	@POST
	@Path("/search")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response searchVirtualMachines(HashMap<String, String> data) {
		loggedUser = (User) request.getSession().getAttribute("user");
		
		if (loggedUser == null || !loggedUser.getRole().equals(Role.superadmin)) {
			return Response.status(403).entity(HelperMethods.GetJsonValue("Unauthorized")).build();
		}
		String name = data.get("name");
		return Response.status(200).entity(VmRepository.searchVirtualMachines(name)).build();
	}

	@POST
	@Path("/getByCompany")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response getbyOrgName(HashMap<String, String> data) {
		loggedUser = (User) request.getSession().getAttribute("user");
		
		if (loggedUser == null) {
			return Response.status(403).entity(HelperMethods.GetJsonValue("Unauthorized")).build();
		}
		return Response.status(200).entity(VmRepository.getVmNamesByCompany(data.get("organization"))).build();
	}
	
	@GET
	@Path("/getByOrganization")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getbyOrganization(HashMap<String, String> data) {
		
		loggedUser = (User) request.getSession().getAttribute("user");
		
		if (loggedUser == null || loggedUser.getRole().equals(Role.superadmin)) {
			return Response.status(403).entity(HelperMethods.GetJsonValue("Unauthorized")).build();
		}


		return Response.status(200).entity(VmRepository.getVirtualMachinesByCompany(loggedUser.getOrganization())).build();

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
		return Response.status(200).entity(VmRepository.findByName(data.get("name"))).build();
	}
	
	@POST
	@Path("/filter")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response filterVirtualMachines(HashMap<String, String> data) {
		loggedUser = (User) request.getSession().getAttribute("user");
		
		if (loggedUser == null || !loggedUser.getRole().equals(Role.superadmin)) {
			return Response.status(403).entity(HelperMethods.GetJsonValue("Unauthorized")).build();
		}
		return Response.status(200).entity(VmRepository.filterVirtualMachines(data)).build();
	}
	
	
	@POST
	@Path("/offOn")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response turnVirtualMachinesOffOn(HashMap<String, String> data) {
		loggedUser = (User) request.getSession().getAttribute("user");
		
		if (loggedUser == null || loggedUser.getRole().equals(Role.user)) {
			return Response.status(403).entity(HelperMethods.GetJsonValue("Unauthorized")).build();
		}
		return Response.status(200).entity(HelperMethods.GetJsonValue(VmRepository.turnVirtualMachinesOffOn(data))).build();
	}

	@POST
	@Path("/update")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateVM(HashMap<String, String> data) {
		loggedUser = (User) request.getSession().getAttribute("user");
		
		if (loggedUser == null || loggedUser.getRole().equals(Role.user)) {
			return Response.status(403).entity(HelperMethods.GetJsonValue("Unauthorized")).build();
		}
		if (!data.get("oldName").equals(data.get("name")) && !VmRepository.isUniqueVm(data.get("name"))) {
			return Response.status(200).entity(HelperMethods.GetJsonValue("existError")).build();
		}
		boolean success = VmRepository.updateVm(data);
		if (!success) {
			return Response.status(400).entity("Bad request").build();
		}
		return Response.status(200).entity(HelperMethods.GetJsonValue("success")).build();
		

	}
}
