package controller;

import net.sf.json.JSONObject;
import service.UserImpl;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;


@WebServlet(name="RegisterServlet",urlPatterns="/RegisterServlet")
public class RegisterServlet extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        request.setCharacterEncoding("utf-8");
        response.setContentType("text/html;charset=UTF-8;pageEncoding=UTF-8");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        String username = request.getParameter("username");

        UserImpl service = new UserImpl();
        Boolean data = service.checkUserExist(username);
        JSONObject result = new JSONObject();
        if(data){
            result.put("valid",false);
        }else {
            result.put("valid",true);
        }
        out.write(result.toString());
        out.flush();
        out.close();
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        response.setContentType("text/html;charset=UTF-8;pageEncoding=UTF-8");
        response.setCharacterEncoding("UTF-8");
        //response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        String userJson = request.getParameter("user");

        UserImpl service = new UserImpl();
        String data = service.RegisterUser(userJson);
        JSONObject result = new JSONObject();
        result.put("result",data);
        out.write(result.toString());
        out.flush();
        out.close();
    }
}
