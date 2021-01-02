import WebSocket from "ws";
import Config from "../config.js";
import Debug from "./debugger.js";
import CommandInterpreter from "./commandInterpreter.js";
import Utility from "./util.js";
import Game from "./game.js";

const Util = new Utility();

class WebsocketManager{

    StartServer(debugMode = false){
        this.debugMode = debugMode;

        Debug.Log("======================================", "yellow");
        Debug.Log("Debug Mode is ON","yellow","bold");

        const wss = new WebSocket.Server({ port: Config.port });

        this.clients = [];
        this.zones = [];

        const me = this;

        wss.on('connection', (ws) => {
            me.HandleConnection(ws);

            ws.on('message', (message) => {
                me.HandleMessage(ws,message);
            });

            ws.on('close', () => {
                me.HandleDisconnect(ws);
            });
        });
    }
    HandleConnection(ws) {
        Debug.Log("Client connected: "+ws,"cyan");
        ws.send('Successfully connected to websocket server!');

        ws.isAlive = true;
        //on connection add client to list
        ws.id = this.uniqueId();
        this.clients[ws.id] = ws;
        this.clients[ws.id].id = ws.id;
    }
    HandleDisconnect(ws){
        let user = "Guest";
        let client = this.clients[ws.id];
        if(client.username){
            user = client.username;
            Game.DespawnPlayer(ws);
        }
        Debug.Log("Client disconnected (User: "+user+" | socket id: "+ws.id+")","red");
    }
    HandleMessage(ws, message){
        let msg = {};
        try{
            msg = JSON.parse(message);
        }catch{
            Debug.Log('Client message is not a JSON object.','red')
        }
        if(this.debugMode) Debug.Log('client: '+ message, 'yellow', 'dim');

        let cmdInterpreter = new CommandInterpreter();
        cmdInterpreter.InterpretCommand(ws, msg.cmd, msg.data);
    }

    SendData(ws,data){
        data = JSON.stringify(data);
        ws.send(data, (error) => {
            //console.log(error);
        });
    }
    //broadcast to zone but exclude client (Standard broadcast)
    BroadcastDataZone(ws,data,excludeClient = true){
        data = JSON.stringify(data);

        let client = this.clients[ws.id];
        let thisZone = this.zones[client.zone];

        if(Util.IsDefined(thisZone) && Util.IsDefined(thisZone.clients)){
            for(let c of thisZone.clients){

                if(excludeClient && c == client) continue;
                c.send(data, function (error){
                    //if(error) console.log(error+"\r\n"); //Removed message error to stop crashing
                });
            }
        }
    }
    BroadcastDataAll(data){

        data = JSON.stringify(data);
        for(let i in this.clients){

            this.clients[i].send(data, function (error){
                //if(error) console.log(error+"\r\n"); //Removed message error to stop crashing
            });
        }
    }
    AddClientToZone = function(client,zone){

        if(this.zones[zone] == null){
            this.zones[zone] = {};
        }
        if(this.zones[zone].clients == null){
            this.zones[zone].clients = [];
        }
        client.zone = zone;
        Debug.Log("Adding client "+client.username+" to zone "+zone, "cyan")
        this.zones[zone].clients.push(client);
    }
    RemoveClientFromZone = function(client,zone){
        let ind = this.zones[zone].clients.indexOf(client);
        this.zones[zone].clients.splice(ind, 1);
    }

    uniqueId = function() {
        return 'id-' + Math.random().toString(36).substr(2, 16);
    };
}

export default (new WebsocketManager);