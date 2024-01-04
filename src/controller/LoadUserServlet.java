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

@WebServlet(name="LoadUserServlet",urlPatterns="/LoadUserServlet")
public class LoadUserServlet extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();

        HttpSession session=request.getSession();

        Object obj=session.getAttribute("email");

        if(obj==null){
            //返回空的标识
            JSONObject user = new JSONObject();
            //just for test
            user.put("email","");
            out.write(user.toString());
        }else{
            //返回用户名和uid
            JSONObject user = new JSONObject();
            user.put("email",session.getAttribute("email").toString());
            user.put("name",session.getAttribute("name").toString());
            user.put("uid",session.getAttribute("uid").toString());
            out.write(user.toString());
        }
        out.flush();
        out.close();
    }


    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        doGet(request,response);
    }
}
