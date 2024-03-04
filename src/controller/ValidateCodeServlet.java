package controller;

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

@WebServlet(name="ValidateCodeServlet",urlPatterns="/ValidateCodeServlet")
public class ValidateCodeServlet extends HttpServlet {
    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/html;charset=utf-8");
        resp.setCharacterEncoding("utf-8");
        PrintWriter out = resp.getWriter();

        req.setCharacterEncoding("utf-8");
        HttpSession session=req.getSession();

        String register_code=req.getParameter("register_code");
        if(register_code.equals(session.getAttribute("register_code"))){
            out.write("true");
        }
        else{
            out.write("false");
        }

        out.flush();
        out.close();
    }
    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/html;charset=utf-8");
        resp.setCharacterEncoding("utf-8");
        PrintWriter out = resp.getWriter();

        req.setCharacterEncoding("utf-8");
        HttpSession session=req.getSession();

        String register_code=req.getParameter("code");
        if(register_code.equals(session.getAttribute("reset_code"))){
            out.write("true");
        }
        else{
            out.write("false");
        }

        out.flush();
        out.close();
    }
}
