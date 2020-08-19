package services;

import java.io.File;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
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
import model.Role;
import model.User;
import repository.OrganizationRepository;

@Path("/organizations")
public class OrganizationService {

	@Context
	HttpServletRequest request;
	
	User loggedUser;

	@POST
	@Path("/add")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response addOrganization(HashMap<String, String> data) {
		
		loggedUser = (User) request.getSession().getAttribute("user");
		
		if (loggedUser == null || loggedUser.getRole().equals(Role.user)) {
			return Response.status(403).entity(HelperMethods.GetJsonValue("Unauthorized")).build();
		}
		if (!OrganizationRepository.isUniqueOrg(data.get("name"))) {
			return Response.status(200).entity(HelperMethods.GetJsonValue("existError")).build();
		}
		String organizationJson = OrganizationRepository.saveOrganization(data.get("name"), data.get("description"));
		request.getSession().setAttribute("organization", data.get("name"));
		if (organizationJson == null) {
			return Response.status(400).entity("Error adding organization").build();
		}
		return Response.status(200).entity(organizationJson).build();

	}

	@POST
	@Path("/uploadImage")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Produces(MediaType.APPLICATION_JSON)
	public String uploadImage(InputStream is) throws IOException {
		
		String name = (String) request.getSession().getAttribute("organization");
		String imageName = name.replaceAll("\\s", "") + ".jpg";

		int read = 0;
		byte[] bytes = new byte[1024];
		File f = new File(
				"C:\\Users\\Vuk\\Desktop\\Faks\\5_semestar\\Web\\vezbe\\10-REST\\WebShopREST\\WebContent\\imgs\\"
						+ imageName);

		OutputStream os = new FileOutputStream(f);

		while ((read = is.read(bytes)) != -1) {
			os.write(bytes, 0, read);
		}

		os.flush();
		os.close();

		return HelperMethods.GetJsonValue("success");

	}

	@GET
	@Path("/getAll")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getOrganizations() {
		loggedUser = (User) request.getSession().getAttribute("user");
		
		if (loggedUser == null || !loggedUser.getRole().equals(Role.superadmin)) {
			return Response.status(403).entity(HelperMethods.GetJsonValue("Unauthorized")).build();
		}
		ArrayList<Organization> organizations = OrganizationRepository.getOrganizations();

		return Response.status(200).entity(organizations).build();

	}

	@GET
	@Path("/getAllNames")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getOrganizationsNames() {
		loggedUser = (User) request.getSession().getAttribute("user");
		
		if (loggedUser == null) {
			return Response.status(403).entity(HelperMethods.GetJsonValue("Unauthorized")).build();
		}
		List<String> organizations = OrganizationRepository.getOrganizationsNames();

		return Response.status(200).entity(organizations).build();

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
		if (OrganizationRepository.deleteOrganization(name)) {
			return Response.status(200).entity(OrganizationRepository.getOrganizations()).build();
		}

		return Response.status(400).entity(HelperMethods.GetJsonValue("error")).build();
	}

	@POST
	@Path("/search")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response searchOrganization(HashMap<String, String> data) {
		loggedUser = (User) request.getSession().getAttribute("user");
		
		if (loggedUser == null || !loggedUser.getRole().equals(Role.superadmin)) {
			return Response.status(403).entity(HelperMethods.GetJsonValue("Unauthorized")).build();
		}
		String name = data.get("name");
		return Response.status(200).entity(OrganizationRepository.searchOrganizations(name)).build();

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
		Organization organization = OrganizationRepository.findByName(data.get("name"));
		if (organization == null) return Response.status(400).entity("Error getting organization").build();
		return Response.status(200).entity(organization).build();

	}
	
	@POST
	@Path("/update")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateOrganization(HashMap<String, String> data) {
		
		loggedUser = (User) request.getSession().getAttribute("user");
		
		if (loggedUser == null || loggedUser.getRole().equals(Role.user)) {
			return Response.status(403).entity(HelperMethods.GetJsonValue("Unauthorized")).build();
		}
		if (!data.get("name").equals(data.get("oldName")) && !OrganizationRepository.isUniqueOrg(data.get("name"))) {
			return Response.status(200).entity(HelperMethods.GetJsonValue("existError")).build();
		}
		boolean condition = !OrganizationRepository.updateOrganization(data);
		if (condition) {
			return Response.status(400).entity("Error updating organization").build();
		}
		request.getSession().setAttribute("organization", data.get("name"));
		return Response.status(200).entity(HelperMethods.GetJsonValue("success")).build();
	}
	@POST
	@Path("/calculatePrice")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response calculateMonthlyBill(HashMap<String, String> data) {
		loggedUser = (User) request.getSession().getAttribute("user");
		
		if (loggedUser == null || !loggedUser.getRole().equals(Role.admin)) {
			return Response.status(403).entity(HelperMethods.GetJsonValue("Unauthorized")).build();
		}
		double price = 0;
		price = OrganizationRepository.calculateMonthlyBill(data.get("organization"), data.get("selectedMonth"));
		
		return Response.status(200).entity(price).build();
		
		
	}
	
}
