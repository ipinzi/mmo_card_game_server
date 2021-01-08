import Database from "./database.js";
import Debug from "./debugger.js";
import WebsocketManager from "./websocket.js";

class PlayerManager{

    constructor() {
        this.conn = new Database();
    }

    //Saving and loading player data
    SavePlayerData(ws){
        this.conn.Query(function(db,conn){

            let client = WebsocketManager.clients[ws.id];
            let user = client.username;
            let key = { username: user };

            let value = { $set: {username: user, position: client.position, zone: client.zone, inventory: client.inventory, cards: client.cards, decks: client.decks} };
            db.collection("characters").updateOne(key, value,{upsert: true}, function(err, res) {
                if (err) throw err;
                Debug.Log("Player data saved for player: "+client.username, "cyan");
                conn.close();
            });
        });
    }
    LoadPlayerData(ws,callbackFunc){
        this.conn.Query(function(db,conn){

            let client = WebsocketManager.clients[ws.id];
            let key = { username: client.username };

            db.collection("characters").findOne(key, function(err, res) {
                if (err) throw err;
                let success = false;
                if(res){
                    success = true;
                    callbackFunc(success,res);
                }else{
                    callbackFunc(success,0,0);
                }

                conn.close();
            });
        });
    }
}
export default PlayerManager