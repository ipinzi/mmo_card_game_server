import Command from "./command.js";
import Database from "../database.js";
import Encryption from "../encryption.js";
import WebsocketManager from "../websocket.js";

class Register extends Command{
    constructor() {
        super();
        this.cmd = "register";
    }

    RunCommand(ws, data) {

        let wsManager = new WebsocketManager();
        let me = this;
        this.RegisterUser(data.email,data.user,data.pass,function(success,message){
            console.log('User Registration: '+message);
            wsManager.SendData(ws,{cmd: me.cmd, success: success, message: message});
        });
    }

    RegisterUser(email,user,pass,callbackFunc){

        let database = new Database();
        let encrypt = new Encryption();

        database.Query(function(db,conn) {

            encrypt.EncryptPassword(pass, function (err, hash) {
                if (err) throw err;

                db.collection('users').findOne({$or: [{username: user}, {email: email}]}, function (err, doc) {
                    if (err) throw err;
                    //if account found
                    if (doc) {
                        callbackFunc(false, "An account with that Username / Email already exists! Try again.");
                        conn.close();
                        return;
                    }

                    if (err) {
                        callbackFunc(false, "Account could not be created. Error: " + err);
                        conn.close();
                        return;
                    }

                    let value = {username: user, email: email, pass: hash};
                    db.collection("users").insertOne(value, {upsert: true}, function (err, res) {

                        conn.close();
                        if (err) {
                            callbackFunc(false, "Account could not be created. Error: " + err);
                            return;
                        }
                        console.log("Account Created!");
                        callbackFunc(true, "New account Successfully Created! Please sign in...");
                        return;
                    });
                });
            });
        });
    }
}
export default Register;