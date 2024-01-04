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
import java.awt.print.Paper;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name="GetArticleListServlet",urlPatterns="/GetArticleListServlet")
public class GetArticleListServlet extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();

        HttpSession session=request.getSession();

        String email=session.getAttribute("email").toString();
        if(email.equals("")){
            out.write("0");
        }
        else{
            PaperImpl paper=new PaperImpl();
            String result=paper.getPaperList(email);
            out.write(result);
        }

        out.flush();
        out.close();
    }


    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        doGet(request,response);
    }
}
