package services;

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
import model.User;
import model.VMcategory;
import repository.DiskRepository;
import repository.UserRepository;
import repository.VmCategoryRepository;

@Path("/users")
public class UserService {

	@Context
	HttpServletRequest request;

	public UserService() {

	}

	@POST
	@Path("/login")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response login(HashMap<String, String> data) {
		User user = UserRepository.login(data.get("email"), data.get("password"));
		if (user == null) {
			return Response.status(400).entity("Invalid username and/or password").build();
		}
		request.getSession().setAttribute("user", user);

		return Response.status(200).entity(HelperMethods.GetJsonValue(user)).build();

	}

	@GET
	@Path("/loggedUser")
	@Produces(MediaType.APPLICATION_JSON)
	public Response loggedUser() {

		User user = (User) request.getSession().getAttribute("user");

		return Response.status(200).entity(HelperMethods.GetJsonValue(user)).build();

	}

	@POST
	@Path("/register")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response register(HashMap<String, String> data) {
		String email = data.get("email");
		if (!UserRepository.isUniqueEmail(email)) {
			return Response.status(400).entity("Email already exists").build();
		}
		String password = data.get("password");
		String firstName = data.get("firstName");
		String lastName = data.get("lastName");
		String organization = data.get("organization");
		String role = data.get("role");
		User user = new User(email, password, firstName, lastName, organization, role);

		return Response.status(200).entity(UserRepository.saveUser(user)).build();

	}

	@GET
	@Path("/logout")
	@Produces(MediaType.APPLICATION_JSON)
	public Response logout() {

		request.getSession().removeAttribute("user");

		return Response.status(200).entity(HelperMethods.GetJsonValue("success")).build();

	}

	@GET
	@Path("/getAll")
	@Produces(MediaType.APPLICATION_JSON)
	public Response findAll() {
		return Response.status(200).entity(UserRepository.getUsers()).build();
	}

	@POST
	@Path("/delete")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response delete(HashMap<String, String> data) {
		String email = data.get("email");
		if (UserRepository.deleteUser(email)) {
			return Response.status(200).entity(UserRepository.getUsers()).build();
		}

		return Response.status(400).entity(HelperMethods.GetJsonValue("error")).build();
	}
	
	
	@POST
	@Path("/updateMyProfile")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateMyProfile(HashMap<String, String> data) {
		User loggedUser = (User) request.getSession().getAttribute("user");
		User user = UserRepository.updateMyProfile(data, loggedUser.getEmail());
		if (user == null) {
			return Response.status(400).entity(HelperMethods.GetJsonValue("Email already exists")).build();
		}
		request.getSession().setAttribute("user", user);
		return Response.status(200).entity(user).build();
	}
	
	@POST
	@Path("/getByEmail")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response getByEmail(HashMap<String, String> data) {
		User user = UserRepository.findByEmail(data.get("email"));
		if (user == null)
			return Response.status(400).entity("Error getting user").build();
		return Response.status(200).entity(user).build();
	}
	
	@POST
	@Path("/updateUser")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateCategory(HashMap<String, String> data) {
		if (!data.get("oldEmail").equals(data.get("email"))
				&& !UserRepository.isUniqueEmail(data.get("email"))) {
			return Response.status(200).entity("existError").build();
		}
		boolean success = UserRepository.updateUser(data);
		if (!success) {
			return Response.status(400).entity("Error updating user").build();
		}
		return Response.status(200).entity(HelperMethods.GetJsonValue(success)).build();
	}
	
}
