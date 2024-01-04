package service;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.Filters;
import com.sun.mail.util.MailSSLSocketFactory;
import dao.DaoImpl;
import dao.IDao;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.bson.Document;
import org.bson.conversions.Bson;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.*;
import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.Date;
import java.util.Properties;
import java.util.UUID;

import static com.mongodb.client.model.Sorts.descending;

public class UserImpl {

    IDao dao=new DaoImpl();

//    public String addUser(String json){
//
//        JSONObject userObj = JSONObject.fromObject(json);
//        MongoCollection<Document> userCol = dao.GetCollection("AGAYGWG", "User");
//        Document user = new Document();
//
//        return "";
//    }

    public boolean checkUserExist(String email) {
        // TODO Auto-generated method stub
        MongoCollection<Document> col=dao.GetCollection("AGAYGWG", "User");

        Document doc=dao.RetrieveDocByOneField(col, "Email", email);
        if(doc==null){
            return false;
        }
        return true;
    }
    public String getUserID(){
        MongoCollection<Document> UserCol = dao.GetCollection("AGAYGWG", "User");
        Document user = UserCol.find().sort(descending("RegisterTime")).first(); //获取集合中最新一条数据
        if(user==null){
            return  "0000";
        }
        String UID =(String) user.get("UID");//获取数据中所需的字段
        return UID;
    }
    public String RegisterUser(String userJson) throws IOException{
        // TODO Auto-generated method stub
        JSONObject userObj = JSONObject.fromObject(userJson);

        String propPath = DaoImpl.class.getResource("/").getPath()+"geomodel.properties";
        InputStream in =new BufferedInputStream(new FileInputStream(propPath));
        //InputStream in=DaoImpl.class.getClassLoader().getResourceAsStream("geomodel.properties");//cache
        Properties properties = new Properties();
        properties.load(in);
//        int userCount = Integer.parseInt(properties.getProperty("userCount"));
        String strid = getUserID();
        int userCount = Integer.parseInt(strid.substring(strid.length()-4, strid.length()))+1;;
        if(checkUserExist(userObj.getString("email"))){
            return "exist";
        }
        try {
            String uid="";
            if(userCount<10){
                uid="000"+userCount;
            }
            else if(userCount<100){
                uid="00"+userCount;
            }
            else if(userCount<1000){
                uid="0"+userCount;
            }
            else if(userCount<10000){
                uid=""+userCount;
            }

            MongoCollection<Document> col=dao.GetCollection("AGAYGWG", "User");
            Document doc=new Document("Email",userObj.getString("email"))
                    .append("UID","AGAYGWG2023_U"+uid)
                    .append("Password",userObj.getString("password"))
                    .append("Name", userObj.getString("name"))
                    .append("Gender", userObj.getString("gender"))
                    .append("Title", userObj.getString("title"))
                    .append("Phone", userObj.getString("phone"))
                    .append("Affiliation",userObj.getString("affiliation"))
                    .append("Position",userObj.getString("position"))
                    .append("Major",userObj.getString("major"))
                    .append("Education",userObj.getString("education"))
//                    .append("Visa",userObj.getString("visa"))
                    .append("Articles",new ArrayList<>())
                    .append("RegisterTime", new Date());
            col.insertOne(doc);
            properties.setProperty("userCount",Integer.toString(++userCount));
            FileOutputStream  out =new FileOutputStream(propPath);
            properties.store(out,null);
            in.close();
            out.close();
        } catch (Exception e) {
            // TODO: handle exception
            return "false";
        }
        return "true";
    }

    public JSONObject ValidPassword(String email,String password) {
        // TODO Auto-generated method stub

        MongoCollection<Document> col=dao.GetCollection("AGAYGWG", "User");

        Document doc=dao.RetrieveDocByOneField(col, "Email", email);
        if(doc!=null){
            String user_password=doc.getString("Password");
            if(user_password.toString().equals(password.trim())){
                JSONObject result=new JSONObject();
                result.put("name",doc.getString("Title")+" "+doc.getString("Name"));
                result.put("uid",doc.getString("UID"));
                return result;
            }

        }
        return null;
    }

    public String ResetPassword(String email,String password){

        MongoCollection<Document> UserCol=dao.GetCollection("AGAYGWG", "User");

        Bson find = Filters.eq("Email", email);
        FindIterable<Document> findIterable = UserCol.find(find);
        MongoCursor<Document> cursor = findIterable.iterator();

        if(cursor.hasNext()){
            Document doc = cursor.next();
            doc.put("Password",password);
            UserCol.replaceOne(Filters.eq("Email", email), doc);
        }

        return "";
    }

    public JSONObject SendPassword(String email){

        JSONObject result=sendEmail(email,new JSONObject(),false);

        return result;
    }

    public String ValidateEmail(String mail) {
        JSONObject jsonObject = new JSONObject();

        MongoCollection<Document> ModelItemCol = dao.GetCollection("AGAYGWG", "User");
        Bson filters = Filters.eq("Email", mail);
        MongoCursor<Document> docs = ModelItemCol.find(filters).iterator();
        if(docs.hasNext()){
            jsonObject.put("result","exist");
        }
        else {
            jsonObject=sendEmail(mail,jsonObject,true);
        }
        return jsonObject.toString();
    }

    public String ValidateEmail_reset(String mail){
        JSONObject jsonObject = new JSONObject();

        MongoCollection<Document> ModelItemCol = dao.GetCollection("AGAYGWG", "User");
        Bson filters = Filters.eq("Email", mail);
        MongoCursor<Document> docs = ModelItemCol.find(filters).iterator();
        if(docs.hasNext()){
            jsonObject=sendEmail(mail,jsonObject,true);

        }
        else {
            jsonObject.put("result","none");
        }
        return jsonObject.toString();
    }

    JSONObject sendEmail(String mail,JSONObject jsonObject,boolean isCode){

        InputStream in = UserImpl.class.getClassLoader().getResourceAsStream("geomodel.properties");
        Properties properties = new Properties();
        try {
            properties.load(in);
            String HOST = properties.getProperty("stmpHost");
            String PROTOCOL = properties.getProperty("stmpProtocol");
            String PORT = properties.getProperty("stmpPort");
            String SENDER = properties.getProperty("stmpEmail");
            String SENDERPWD = properties.getProperty("stmpPass");

            Properties send = new Properties();

            send.put("mail.smtp.host", HOST);
            send.put("mail.store.protocol", PROTOCOL);
            send.put("mail.smtp.port", PORT);
            send.put("mail.smtp.auth", true);
            MailSSLSocketFactory sf=new MailSSLSocketFactory();
            sf.setTrustAllHosts(true);
            send.put("mail.smtp.ssl.enable","true");
            send.put("mail.smtp.ssl.socketFactory",sf);

            Authenticator authenticator = new Authenticator() {
                @Override
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(SENDER, SENDERPWD);
                }
            };

            Session session = Session.getInstance(send, authenticator);

            Message message = new MimeMessage(session);
//            message.addRecipients(MimeMessage.RecipientType.CC, InternetAddress.parse("wdj2022nnu@163.com"));
            message.setFrom(new InternetAddress(SENDER, "AGAYGWG", "UTF-8"));
            message.setRecipient(MimeMessage.RecipientType.TO, new InternetAddress(mail));

            if(isCode){
                String validate = UUID.randomUUID().toString().substring(0, 4);
                message.setSubject("AGAYGWG Mailbox Verification Code");
                String emailMsg = "Your Verification Code is : <b>" + validate + "</b>";
                message.setContent(emailMsg, "text/html;charset=utf-8");

                Transport.send(message);

                jsonObject.put("result", "success");
                jsonObject.put("code", validate);
            }
            else{
                MongoCursor<Document> cursor=dao.GetCursor("AGAYGWG","User","Email",mail);
                if(cursor.hasNext()){
                    Document doc=cursor.next();
                    message.setSubject("AGAYGWG Password");
                    String emailMsg = "Your password is : <b>" + doc.getString("Password") + "</b>";
                    message.setContent(emailMsg, "text/html;charset=utf-8");

                    Transport.send(message);

                    jsonObject.put("result", "success");
                }
                else {
                    jsonObject.put("result", "none");
                }

            }

        } catch (IOException e) {
            e.printStackTrace();
            jsonObject.put("result", "error");
        } catch (MessagingException e) {
            e.printStackTrace();
            jsonObject.put("result", "error");
        } catch (GeneralSecurityException e) {
            throw new RuntimeException(e);
        }

        return jsonObject;

    }


}
