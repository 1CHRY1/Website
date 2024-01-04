package controller;

import net.sf.json.JSON;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import service.SubmitImpl;
import service.UserImpl;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Iterator;
import java.util.List;

@WebServlet(name="SubmitServlet",urlPatterns="/SubmitServlet")
public class SubmitServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    File tempPathFile;

    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        super.doPost(request,response);
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        JSONObject result = new JSONObject();

        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();

        request.setCharacterEncoding("utf-8");
        //String file = request.getParameter("inputFile");
        String pid=request.getParameter("pid");
        String type=request.getParameter("type");
        String title = request.getParameter("title");
        String sess = request.getParameter("sess");
        Object authors = request.getParameter("authors");
        JSONArray authorArray=JSONArray.fromObject(authors);
        String abstract0 = request.getParameter("abstract");
        String keywords = request.getParameter("keywords");
        String EPA = request.getParameter("EPA");
        String fileExist=request.getParameter("fileExist");
        HttpSession session=request.getSession();
        String email=session.getAttribute("email").toString();

        try {
            // Create a factory for disk-based file items
            DiskFileItemFactory factory = new DiskFileItemFactory();

            // Set factory constraints
            factory.setSizeThreshold(4096);
            factory.setRepository(tempPathFile);//

            // Create a new file upload handler
            ServletFileUpload upload = new ServletFileUpload(factory);

            // Set overall request size constraint
            upload.setSizeMax(1024*1024*1024);

            List<FileItem> items = upload.parseRequest(request);
            Iterator<FileItem> i = items.iterator();
            if (i.hasNext()) {
                FileItem fi = i.next();
                SubmitImpl submit=new SubmitImpl();
                if(type.equals("submit")){
                    submit.addArticle(pid,title,sess,authorArray,abstract0,keywords,EPA,email,fi,fileExist);
                }
                else {
                    submit.saveArticle(pid,title,sess,authorArray,abstract0,keywords,EPA,email,fi,fileExist);
                }

            }

            result.put("result","success");
        } catch (Exception e) {
            result.put("result","error");
        }

        out.write(result.toString());

        out.flush();
        out.close();
    }
}
