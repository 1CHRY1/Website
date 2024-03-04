package controller;

import service.PaperImpl;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name="ChangePaperStatusServlet",urlPatterns="/ChangePaperStatusServlet")
public class ChangePaperStatusServlet extends HttpServlet {

    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();

        String pid=request.getParameter("pid");
        String status=request.getParameter("status");

        PaperImpl paper=new PaperImpl();
        out.write(paper.ChangePaperStatus(pid,status));

        out.flush();
        out.close();
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        doPost(request,response);
    }

}
