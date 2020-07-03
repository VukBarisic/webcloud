package services;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import helpers.HelperMethods;
import model.Organization;
import model.User;
import repository.Repository;

@Path("/organizations")
public class OrganizationService {
	
	
	@Context
	ServletContext ctx;
	@Context
	HttpServletRequest request;

	
	@PostConstruct
	public void init() {
		if (ctx.getAttribute("organizations") == null) {
			ctx.setAttribute("organizations", Repository.getOrganizations());
		}
	}

	@POST
	@Path("/add")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response addOrganization(HashMap<String, String> data) {
		if (!Repository.isUniqueOrg(data.get("name"))) {
			return Response.status(200).entity("existError").build();
		}
		String organizationJson = Repository.saveOrganization(data.get("name"), data.get("description"));
		request.getSession().setAttribute("organisation", data.get("name"));
		if (organizationJson == null) {
			return Response.status(400).entity("Error adding organization").build();
		}
		ctx.setAttribute("organizations", Repository.getOrganizations());
		return Response.status(200).entity(HelperMethods.GetJsonValue(organizationJson)).build();

	}
	
	@POST
	@Path("/uploadImage")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Produces(MediaType.APPLICATION_JSON)
	public String uploadImage(InputStream is) throws IOException
	{	
		String name = (String) request.getSession().getAttribute("organisation");
		String imageName = name.replaceAll("\\s","") + ".jpg";
		
		int read = 0;
		byte[] bytes = new byte[1024];
		File f = new File("C:\\Users\\Vuk\\Desktop\\Faks\\5_semestar\\Web\\vezbe\\10-REST\\WebShopREST\\WebContent\\imgs\\"+ imageName);
		
		OutputStream os = new FileOutputStream(f);

		while ((read = is.read(bytes)) != -1) 
		{
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
		ArrayList<Organization> organizations = Repository.getOrganizations();

		return Response.status(200).entity(organizations).build();

	}
	
	@POST
	@Path("/deleteOrganization")
	@Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
	public Response deleteTerritory(HashMap<String, String> data)
	{
		String name = data.get("name");
		if (Repository.deleteOrganization(name)) {
			return Response.status(200).entity(Repository.getOrganizations()).build();
		}
		
		return Response.status(400).entity(HelperMethods.GetJsonValue("error")).build();
	}
	
	@POST
	@Path("/searchOrganization")
	@Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
	public Response searchOrganization(HashMap<String, String> data)
	{
		String name = data.get("name");
		return Response.status(200).entity(Repository.searchOrganizations(name)).build();

		
	}
}
