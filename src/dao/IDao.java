package dao;

import com.mongodb.client.MongoCursor;
import org.bson.Document;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

public interface IDao {
    MongoDatabase GetDB(String dbName);
    MongoCollection<Document> GetCollection(String dbName, String collName);
    Document RetrieveDocByOneField(MongoCollection<Document> collectionName, String dbFieldName, String fieldName);
    MongoCursor<Document> GetCursor(String dbName,String colName,String field,String value);

}
