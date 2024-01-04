package controller;

import net.sf.json.JSONObject;
import service.PaperImpl;
import service.UserImpl;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name="SendPasswordServlet",urlPatterns="/SendPasswordServlet")
public class SendPasswordServlet extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin","http://175.27.137.60:8088");
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();

        String email=request.getParameter("email");

        UserImpl user=new UserImpl();
        JSONObject result=user.SendPassword(email);

        out.write(result.toString());

        out.flush();
        out.close();
    }


    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        doGet(request,response);
    }

}
