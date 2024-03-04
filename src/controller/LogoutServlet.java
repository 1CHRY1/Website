package controller;

import net.sf.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name="LogoutServlet",urlPatterns="/LogoutServlet")
public class LogoutServlet extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();

        HttpSession session = request.getSession(false);//防止创建Session
        if(session == null){
            //response.sendRedirect("/Web/index.jsp");
            return;
        }

        session.removeAttribute("email");
        session.removeAttribute("name");

        JSONObject result = new JSONObject();
        result.put("result","success");
        out.write(result.toString());
        out.flush();
        out.close();
        //response.sendRedirect("/Web/index.jsp");
    }


    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        doGet(request,response);
    }
}
