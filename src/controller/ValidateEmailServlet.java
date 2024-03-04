package controller;

import net.sf.json.JSONObject;
import service.UserImpl;

import javax.servlet.http.HttpSession;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name="ValidateEmailServlet",urlPatterns="/ValidateEmailServlet")
public class ValidateEmailServlet extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/html;charset=utf-8");
        resp.setCharacterEncoding("utf-8");
        PrintWriter out = resp.getWriter();

        req.setCharacterEncoding("utf-8");
        String email = req.getParameter("email");
        UserImpl service = new UserImpl();
        JSONObject result = JSONObject.fromObject(service.ValidateEmail(email));
        HttpSession session=req.getSession();
        if(result.getString("result").equals("success")) {
            session.setAttribute("register_code", result.getString("code"));
        }
        out.write(result.getString("result"));
        out.flush();
        out.close();
    }
    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/html;charset=utf-8");
        resp.setCharacterEncoding("utf-8");
        PrintWriter out = resp.getWriter();

        req.setCharacterEncoding("utf-8");
        String email = req.getParameter("email");
        UserImpl service = new UserImpl();
        JSONObject result = JSONObject.fromObject(service.ValidateEmail_reset(email));
        HttpSession session=req.getSession();
        if(result.getString("result").equals("success")) {
            session.setAttribute("reset_code", result.getString("code"));
        }
        out.write(result.getString("result"));
        out.flush();
        out.close();
    }
}
