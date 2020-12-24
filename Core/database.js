import MongoClient from "mongodb";
import Config from "../config.js";

const url = Config.db_host_url+Config.db_name;

class Database {

    Query = function(callbackFunc){
        MongoClient.connect(url, {useUnifiedTopology: true},function(err, db) {
            if (err) throw err;
            //console.log("Connected to Database.");
            let dbo = db.db(Config.db_name);
            callbackFunc(dbo,db);
            //db.close();
        });
    }
}
export default Database;