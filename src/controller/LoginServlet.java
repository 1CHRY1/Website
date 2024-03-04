package controller;

import net.sf.json.JSON;
import net.sf.json.JSONObject;
import service.UserImpl;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name="LoginServlet",urlPatterns="/LoginServlet")
public class LoginServlet extends HttpServlet {


	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		super.doPost(request,response);
	}


	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		response.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=UTF-8");
		PrintWriter out = response.getWriter();

		String email = request.getParameter("email");
		String password = request.getParameter("password");

		UserImpl service=new UserImpl();
		JSONObject user = service.ValidPassword(email, password);
		if (user!=null) {
			HttpSession session=request.getSession();
			session.setAttribute("email", email);//uid
			session.setAttribute("name",user.getString("name"));
			session.setAttribute("uid",user.getString("uid"));
			out.write("1");
		} else {
			out.write("0");
		}
		out.flush();
		out.close();
	}

}
