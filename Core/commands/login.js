import Command from "./command.js";
import Database from "../database.js";
import Encryption from "../encryption.js";
import WebsocketManager from "../websocket.js";
import Game from "../game.js";

class Login extends Command{
    constructor() {
        super();
        this.cmd = "login";
    }
    RunCommand(ws,data){

        let client = WebsocketManager.clients[ws.id];
        let me = this;
        this.LogInUser(ws, data.username,data.password,(success, loginData)=>{
            console.log('User Login: '+loginData.message);
            if(success){
                console.log('User Logged in: '+loginData.username);
                client.username = loginData.username;
                WebsocketManager.SendData(ws,{cmd: me.cmd, success: success, message: loginData.message, username: loginData.username});
                return true;
            }else{
                WebsocketManager.SendData(ws,{cmd: me.cmd, success: success, message: loginData.message});
                return false;
            }
        });
    }
    LogInUser(ws, user, pass, callbackFunc){
        if(user == ""){
            callbackFunc(false,{message:"User cannot be empty."});
            return;
        }
        if(pass == ""){
            callbackFunc(false,{message:"Password cannot be empty."});
        }else{
            let database = new Database();
            let encrypt = new Encryption();
            database.Query(function(db,conn){

                //FIND ONE BY USER OR EMAIL EXAMPLE
                //Uses the $or operator in the key to find a document with one or both
                //All vars returned are in the res variable (eg: res.username or res.email)
                let key = { $or: [ { username: user}, { email: user } ] };
                db.collection("users").findOne(key, function(err, res) {

                    if (err) throw err;

                    if(!res) {
                        callbackFunc(false, {message: "No user by that name!"});
                        conn.close();
                        return;
                    }
                    encrypt.ComparePassword(pass,res.pass,function(err,isPasswordMatch){
                        if (err) throw err;
                        if(isPasswordMatch){

                            Game.SpawnPlayer(ws);
                            callbackFunc(true,{message:"Successfully Logged in!", username: res.username });
                            conn.close();
                            return;
                        }
                        callbackFunc(false,{message:"Wrong Password!"});
                        conn.close();
                        return;
                    });
                });
            });
        }
    }
}
export default Login;