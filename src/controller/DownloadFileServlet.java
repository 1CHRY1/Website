package controller;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import service.PaperImpl;
import service.SubmitImpl;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.*;
import java.net.URLEncoder;
import java.util.Iterator;
import java.util.List;

@WebServlet(name="DownloadFileServlet",urlPatterns="/DownloadFileServlet")
public class DownloadFileServlet extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        super.doPost(request,response);
    }

    public void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        req.setCharacterEncoding("utf-8");
        String pid = req.getParameter("pid");
        try{
            resp.reset();

            PaperImpl paper=new PaperImpl();
            String filePath=paper.getFilePath(pid);

            String[] path_arr=filePath.split("/");

            String resultFileName = path_arr[path_arr.length-1];
            resultFileName = URLEncoder.encode(resultFileName,"UTF-8");
            resp.setCharacterEncoding("UTF-8");
            resp.setHeader("Content-disposition", "attachment; filename=" + resultFileName);
            String[] name_arr=resultFileName.split("\\.");
            String suffix=name_arr[name_arr.length-1];
            if(suffix.equals(".doc")){
                resp.setContentType("application/msword");
            }
            else{
                //resp.setContentType("application/msword");
                resp.setContentType("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            }

            DataInputStream in = new DataInputStream(new FileInputStream(new File(filePath)));

            OutputStream out = resp.getOutputStream();

            int bytes = 0;
            byte[] bufferOut = new byte[1024];
            while ((bytes = in.read(bufferOut)) != -1) {
                out.write(bufferOut, 0, bytes);
            }
            out.close();
            in.close();
        } catch(Exception e){
            e.printStackTrace();
            resp.reset();
            try {
                OutputStreamWriter writer = new OutputStreamWriter(resp.getOutputStream(), "UTF-8");
                String data = "<script language='javascript'>alert(\"\\u64cd\\u4f5c\\u5f02\\u5e38\\uff01\");</script>";
                writer.write(data);
                writer.close();
            } catch (IOException e1) {
                e1.printStackTrace();
            }
        }

    }
}
