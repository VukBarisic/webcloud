package services;

import java.util.HashMap;


import java.util.List;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
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
import repository.Repository;

@Path("/users")
public class UserService {

	@Context
	ServletContext ctx;
	@Context
	HttpServletRequest request;

	public UserService() {

	}

	@PostConstruct
	public void init() {
		if (ctx.getAttribute("users") == null) {
			ctx.setAttribute("users", Repository.getUsers());
		}
	}

	@POST
	@Path("/login")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response login(HashMap<String, String> data) {
		User user = Repository.login(data.get("email"), data.get("password"));
		if (user == null) {
			return Response.status(400).entity("Invalid username and/or password").build();
		}
		request.getSession().setAttribute("user", user);
		List<User> users = (List<User>) ctx.getAttribute("users");
		for (User user2 : users) {
			System.out.println(HelperMethods.GetJsonValue(user2));
		}
		
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
	public String register(HashMap<String, String> data) {
		String email = data.get("email");
		/*
		 * HashMap<String, User> users = Repository.getUsers(); if
		 * (users.containsKey(username)) { return
		 * HelperMethods.GetJsonValue("existError"); }
		 */

		String password = data.get("password");
		String firstName = data.get("firstName");
		String lastName = data.get("lastName");
		String organisation = data.get("organisation");
		String role = data.get("role");
		User user = new User(email, password, firstName, lastName, organisation, role);

		return Repository.saveUser(user);

	}
	
	@GET
	@Path("/logout")
	@Produces(MediaType.APPLICATION_JSON)
	public Response logout() {

		request.getSession().removeAttribute("user");

		return Response.status(200).entity(HelperMethods.GetJsonValue("success")).build();

	}
	

}
