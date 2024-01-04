package dao;

import com.mongodb.*;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import org.bson.Document;
import org.bson.conversions.Bson;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

public class DaoImpl implements IDao {
    private final static String HOST = "localhost";
    private final static int PORT = 27017;
    private final static int POOLSIZE = 100;
    private final static int BLOCKSIZE = 100;
    private static MongoClient client= null;
    private static InputStream in=DaoImpl.class.getClassLoader().getResourceAsStream("geomodel.properties");
    private static Properties properties;

//    static{
//        properties = new Properties();
//        try {
//            properties.load(in);
//            String host = properties.getProperty("host");
//            String port = properties.getProperty("port");
//            String uri = properties.getProperty("uri");
//            System.out.println("");
//            MongoClientOptions.Builder builder = new MongoClientOptions.Builder();
//
//            builder.connectionsPerHost(10);
//            builder.connectTimeout(10000);
//            builder.maxWaitTime(120000);
//            builder.socketKeepAlive(false);
//            builder.cursorFinalizerEnabled(true);
//            builder.threadsAllowedToBlockForConnectionMultiplier(5000);//Out of semaphores to get db
//            builder.writeConcern(WriteConcern.SAFE);
//            MongoClientOptions options = builder.build();
//
////            client = new MongoClient(host,options);
//            client = new MongoClient(uri);
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//    }

    private void initMongoDB(){
        properties = new Properties();
        try {
            properties.load(in);
            String host = properties.getProperty("host");
            String port = properties.getProperty("port");
            String username = properties.getProperty("username");
            String password = properties.getProperty("password");
            String database = properties.getProperty("database");
            String uri = properties.getProperty("uri");

//            MongoClientOptions.Builder builder = new MongoClientOptions.Builder();
//            builder.connectionsPerHost(10);
//            builder.connectTimeout(10000);
//            builder.maxWaitTime(120000);
//            builder.socketKeepAlive(false);
//            builder.cursorFinalizerEnabled(true);
//            builder.threadsAllowedToBlockForConnectionMultiplier(5000);//Out of semaphores to get db
//            builder.writeConcern(WriteConcern.SAFE);
//            MongoClientOptions options = builder.build();

            List<ServerAddress> adds = new ArrayList<>();
            //ServerAddress()两个参数分别为 服务器地址 和 端口
            ServerAddress serverAddress = new ServerAddress(host, Integer.parseInt(port));
            adds.add(serverAddress);

            List<MongoCredential> credentials = new ArrayList<>();
            //MongoCredential.createScramSha1Credential()三个参数分别为 用户名 数据库名称 密码
            MongoCredential mongoCredential = MongoCredential.createScramSha1Credential(username, database, password.toCharArray());
            credentials.add(mongoCredential);

            //通过连接认证获取MongoDB连接
            client = new MongoClient(adds, credentials);

//            client = new MongoClient(host,options);
//            client = new MongoClient(uri);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public MongoDatabase GetDB(String dbName) {
        // TODO Auto-generated method stub
        if (dbName != null && !"".equals(dbName)) {
            if(client==null){
                initMongoDB();
            }
            MongoDatabase database = client.getDatabase(dbName);
            return database;
        }
        return null;
    }

    @Override
    public MongoCollection<Document> GetCollection(String dbName, String collName) {
        // TODO Auto-generated method stub
        if (null == collName || "".equals(collName)) {
            return null;
        }
        if (null == dbName || "".equals(dbName)) {
            return null;
        }
        MongoCollection<Document> collection = GetDB(dbName).getCollection(collName);
        return collection;
    }

    @Override
    public Document RetrieveDocByOneField(
            MongoCollection<Document> coll, String dbFieldName,
            String fieldName) {
        // TODO Auto-generated method stub
        if(client==null){
            initMongoDB();
        }
        Document myDoc = null;
        try {
            myDoc = coll.find(Filters.eq(dbFieldName, fieldName)).first();
        } catch (Exception e) {
            return null;
        }
        return myDoc;
    }

    @Override
    public MongoCursor<Document> GetCursor(String dbName, String colName, String field, String value){
        MongoCollection<Document> ModelItemCol = GetCollection(dbName, colName);
        Bson filters = Filters.eq(field, value);
        MongoCursor<Document> cursor = ModelItemCol.find(filters).iterator();
        return cursor;
    }
}
