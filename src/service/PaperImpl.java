package service;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.Filters;
import dao.DaoImpl;
import dao.IDao;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.bson.Document;
import org.bson.conversions.Bson;

import javax.print.Doc;
import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;

import static com.mongodb.client.model.Sorts.descending;

public class PaperImpl implements IService {

    IDao dao = new DaoImpl();

    public String getPaperList(String email){

        MongoCollection<Document> UserCol = dao.GetCollection("AGAYGWG", "User");
        Bson find = Filters.eq("Email", email);
        FindIterable<Document> findIterable = UserCol.find(find);
        MongoCursor<Document> cursor = findIterable.iterator();

        JSONArray result=new JSONArray();
        if (cursor.hasNext()) {

            Document doc = cursor.next();
            ArrayList article_ids=doc.get("Articles",ArrayList.class);
            for(int i=0;i<article_ids.size();i++){
                MongoCollection<Document> PaperCol = dao.GetCollection("AGAYGWG", "Paper");
                findIterable = PaperCol.find(Filters.eq("PID",article_ids.get(i)));
                cursor = findIterable.iterator();
                if(cursor.hasNext())
                {
                    Document document=cursor.next();
                    if(document.getBoolean("Show")){
                        result.add(document);
                    }

                }
            }

        }

        return result.toString();
    }

    public String getAllPaper(){

        JSONArray papers=new JSONArray();

        MongoCollection<Document> UserCol = dao.GetCollection("AGAYGWG", "Paper");
        FindIterable<Document> findIterable = UserCol.find();
        MongoCursor<Document> cursor = findIterable.iterator();
        while(cursor.hasNext()){
            JSONObject paper=JSONObject.fromObject(cursor.next());
            papers.add(paper);
        }

        return papers.toString();
    }
    public String getPaperID(){
        MongoCollection<Document> UserCol = dao.GetCollection("AGAYGWG", "Paper");
        FindIterable<Document> documents = UserCol.find();
        String max = "0000";
        for(Document document : documents)
        {
            String str = document.getString("PID");
            str = str.substring(str.length()-4);
            int m = Integer.parseInt(max);
            int n = Integer.parseInt(str);
            if( m < n){
                max = str;
            }
        }
        return max;
    }
    public String getPaper(String pid){

        MongoCollection<Document> UserCol = dao.GetCollection("AGAYGWG", "Paper");
        Bson find = Filters.eq("PID", pid);
        FindIterable<Document> findIterable = UserCol.find(find);
        MongoCursor<Document> cursor = findIterable.iterator();

        if(cursor.hasNext()){
            return JSONObject.fromObject(cursor.next()).toString();
        }
        else{
            return "";
        }

    }

    public String deletePaper(String pid){

        MongoCollection<Document> UserCol = dao.GetCollection("AGAYGWG", "Paper");
        UserCol.updateOne(Filters.eq("PID", pid), new Document("$set", new Document("Show", false)));

        return "";
    }

    public String getFilePath(String pid) {
        MongoCursor<Document> cursor=dao.GetCursor("AGAYGWG","Paper","PID",pid);
        if(cursor.hasNext()){
            Document document=cursor.next();
            String filePath=PaperImpl.class.getClassLoader().getResource("").getPath()+document.getString("FilePath");
            return filePath;
        }

        return null;
    }

    public String ChangePaperStatus(String pid, String status){

        try{
            MongoCollection<Document> PaperCol = dao.GetCollection("AGAYGWG", "Paper");
            Bson find = Filters.eq("PID", pid);
            PaperCol.updateOne(find, new Document("$set", new Document("Status", status)));
            return "success";
        }
        catch (Exception e){
            return e.getMessage();
        }


    }
}
