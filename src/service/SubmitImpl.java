package service;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.Filters;
import dao.DaoImpl;
import dao.IDao;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.commons.fileupload.FileItem;
import org.bson.Document;
import org.bson.conversions.Bson;

import javax.servlet.http.HttpSession;
import java.io.*;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.Properties;

public class SubmitImpl implements IService {

    private String uploadPath;
    String propPath;
    Properties properties;
    InputStream in;
    int paperCount;

    IDao dao = new DaoImpl();

    public String saveArticle(String pid,String title,String sess, JSONArray authors, String abstract0, String keywords,String EPA, String email, FileItem fileItem, String fileExist) throws Exception{
        Date date=new Date();
        Document article_doc = new Document();
        article_doc.append("Title", title);
        article_doc.append("Sess", sess);
        article_doc.append("Authors", authors);
        article_doc.append("Abstract", abstract0);
        article_doc.append("EPA", EPA);
        article_doc.append("Keywords", Arrays.asList(keywords.split(",")));
        article_doc.append("Status", "saved");
        article_doc.append("Show",true);
        article_doc.append("Date", date);
        String fileName=fileItem.getName();
        if(fileName==null){
            if(fileExist.equals("false")){
                    article_doc.append("FilePath", "");
            }
            else{

                mkdir(email,date,"save");

                PaperImpl paper=new PaperImpl();
                JSONObject paperObj=JSONObject.fromObject(paper.getPaper(pid));
                File from=new File(SubmitImpl.class.getClassLoader().getResource("").getPath()+paperObj.getString("FilePath"));
                String path="/article/" + email.replaceAll("@", "_").replaceAll("\\.", "_") +
                        "/save/"+ date.getTime()  + "/" + paperObj.getString("FilePath").split("/")[paperObj.getString("FilePath").split("/").length-1];
                File to=new File(SubmitImpl.class.getClassLoader().getResource("").getPath()+path);
                Files.copy(from.toPath(),to.toPath());
            }

        }
        else{
            mkdir(email,date,"save");

            File fullFile = new File(fileName);
            File savedFile = new File(uploadPath, fullFile.getName());
            fileItem.write(savedFile);
            article_doc.append("FilePath", "/article/" + email.replaceAll("@", "_").replaceAll("\\.", "_")  +"/save/" +  date.getTime() + "/"+ fullFile.getName());
        }

        boolean prop_update=false;

        if(pid==""){
            prop_update=true;
            article_doc.append("PID",generatePID());

            MongoCollection<Document> UserCol = dao.GetCollection("AGAYGWG", "User");
            Bson find = Filters.eq("Email", email);
            FindIterable<Document> findIterable = UserCol.find(find);
            MongoCursor<Document> cursor = findIterable.iterator();
            if (cursor.hasNext()) {
                Document doc = cursor.next();
                JSONObject owner=new JSONObject();
                owner.put("email",email);
                owner.put("name",doc.getString("Name"));
                article_doc.put("Owner",owner);
                UserCol.updateOne(find, new Document("$push", new Document("Articles", article_doc.getString("PID"))));
                dao.GetCollection("AGAYGWG","Paper").insertOne(article_doc);
            }
        }
        else{
            article_doc.append("PID",pid);
            dao.GetCollection("AGAYGWG","Paper").replaceOne(Filters.eq("PID",pid),article_doc);
        }

        if(prop_update){
            updateProp();
            in.close();
        }

        return "";
    }

    public String addArticle(String pid,String title,String sess, JSONArray authors, String abstract0, String keywords,String EPA, String email, FileItem fileItem, String fileExist) throws Exception {

        Date date = new Date();

        Document article_obj = new Document();
        article_obj.append("Title", title);
        article_obj.append("Sess", sess);
        article_obj.append("Authors", authors);
        article_obj.append("Abstract", abstract0);
        article_obj.append("EPA", EPA);
        article_obj.append("Keywords", Arrays.asList(keywords.split(",")));
        article_obj.append("Status", "received");
        article_obj.append("Show",true);
        article_obj.append("Date", date);

//        String propPath = DaoImpl.class.getResource("/").getPath()+"geomodel.properties";
//        InputStream in =new BufferedInputStream(new FileInputStream(propPath));
//        //InputStream in = DaoImpl.class.getClassLoader().getResourceAsStream("geomodel.properties");
//        Properties properties = new Properties();
//        properties.load(in);
//        int paperCount = Integer.parseInt(properties.getProperty("paperCount"));

        boolean prop_update=false;
        if(pid == ""){
            prop_update=true;

            article_obj.append("PID", generatePID());
        }
        else {
            article_obj.append("PID",pid);
        }

        String fileName = fileItem.getName();
        if (fileName != null) {
            mkdir(email,date,"submit");

            File fullFile = new File(fileName);
            File savedFile = new File(uploadPath, fullFile.getName());
            fileItem.write(savedFile);

            article_obj.append("FilePath", "/article/" + email.replaceAll("@", "_").replaceAll("\\.", "_") +  "/submit/" + date.getTime() + "/" +fullFile.getName());

        } else {
            if(fileExist.equals("false")){
                article_obj.append("FilePath", "");
            }

            else{

                mkdir(email,date,"submit");

                PaperImpl paper=new PaperImpl();
                JSONObject paperObj=JSONObject.fromObject(paper.getPaper(pid));
                File from=new File(SubmitImpl.class.getClassLoader().getResource("").getPath()+paperObj.getString("FilePath"));
                String path="/article/" + email.replaceAll("@", "_").replaceAll("\\.", "_") +
                        "/submit/"+ date.getTime()  + "/" + paperObj.getString("FilePath").split("/")[paperObj.getString("FilePath").split("/").length-1];
                File to=new File(SubmitImpl.class.getClassLoader().getResource("").getPath()+path);

                Files.copy(from.toPath(),to.toPath());
                article_obj.append("FilePath",path);
            }

        }

        MongoCollection<Document> UserCol = dao.GetCollection("AGAYGWG", "User");
        Bson find = Filters.eq("Email", email);
        FindIterable<Document> findIterable = UserCol.find(find);
        MongoCursor<Document> cursor = findIterable.iterator();
        if (cursor.hasNext()) {
            Document doc = cursor.next();
            JSONObject owner=new JSONObject();
            owner.put("email",email);
            owner.put("name",doc.getString("Name"));
            article_obj.put("Owner",owner);

            if(prop_update) {
                UserCol.updateOne(find, new Document("$push", new Document("Articles", article_obj.getString("PID"))));
                dao.GetCollection("AGAYGWG", "Paper").insertOne(article_obj);
            }
            else{
                dao.GetCollection("AGAYGWG","Paper").replaceOne(Filters.eq("PID",pid),article_obj);
            }
        }

        if(prop_update) {
            updateProp();
            in.close();
        }
        return "";
    }

    private void mkdir(String email,Date date,String type){
        String path = SubmitImpl.class.getClassLoader().getResource("").getPath();
        uploadPath = path + "/article";
        try {
            if (!new File(uploadPath).isDirectory()) {
                new File(uploadPath).mkdir();
            }
            uploadPath+= "/"+ email.replaceAll("@", "_").replaceAll("\\.", "_");
            if (!new File(uploadPath).isDirectory()) {
                new File(uploadPath).mkdir();
            }
            uploadPath+="/"+type;
            if (!new File(uploadPath).isDirectory()) {
                new File(uploadPath).mkdir();
            }
            uploadPath += "/" + date.getTime();
            if (!new File(uploadPath).isDirectory()) {
                new File(uploadPath).mkdir();
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String  generatePID() throws IOException{
        propPath = DaoImpl.class.getResource("/").getPath()+"geomodel.properties";
        in =new BufferedInputStream(new FileInputStream(propPath));
        //InputStream in = DaoImpl.class.getClassLoader().getResourceAsStream("geomodel.properties");
        properties = new Properties();
        properties.load(in);
        PaperImpl paper=new PaperImpl();
        String strid = paper.getPaperID();
        paperCount = Integer.parseInt(strid)+1;
        String pid="";
        if (paperCount < 10) {
            pid = "000" + paperCount;
        } else if (paperCount < 100) {
            pid = "00" + paperCount;
        } else if (paperCount < 1000) {
            pid = "0" + paperCount;
        } else if (paperCount < 10000) {
            pid = "" + paperCount;
        }
        return "AGAYGWG2023_P"+ pid;
    }
    private void updateProp() throws IOException{
        properties.setProperty("paperCount", Integer.toString(++paperCount));
        FileOutputStream out = new FileOutputStream(propPath);
        properties.store(out, null);
        out.flush();
        out.close();

    }

}
