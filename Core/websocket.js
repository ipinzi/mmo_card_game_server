import WebSocket from "ws";
import Config from "../config.js";
import Debug from "./debugger.js";
import CommandInterpreter from "./commandInterpreter.js";
import Util from "./util.js";
import Game from "./game.js";

class WebsocketManager{

    //Starts the websocket server
    StartServer(debugMode = false){
        this.debugMode = debugMode;
        if(debugMode){
            Debug.Log("======================================", "yellow");
            Debug.Log("Debug Mode is ON","yellow","bold");
        }

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
        ws.id = Util.uniqueId();
        this.clients[ws.id] = {};
        this.clients[ws.id].ws = ws;
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
    //Passes incoming messages from the client to commandInterpreter.cs to run logic
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

    //Sends data to a single client
    SendData(ws,data){
        let strData = JSON.stringify(data);
        ws.send(strData, (error) => {
            //console.log(error);
        });
    }

    //Broadcasts data to ALL clients on the network
    BroadcastDataAll(data){

        data = JSON.stringify(data);
        for(let i in this.clients){

            this.clients[i].send(data, function (error){
                //if(error) console.log(error+"\r\n"); //Removed message error to stop crashing
            });
        }
    }
    //Broadcasts data to all clients excluding this client
    BroadcastData(ws, data){

        data = JSON.stringify(data);
        for(let i in this.clients){
            if(i != this.clients[ws.id]){
                this.clients[i].send(data, function (error){
                    //if(error) console.log(error+"\r\n"); //Removed message error to stop crashing
                });
            }
        }
    }

    //ZONES
    //broadcast to zone, client exclusion can be configured but is off by default
    BroadcastDataZone(ws,data,excludeClient = true){
        data = JSON.stringify(data);

        let client = this.clients[ws.id];
        let thisZone = this.zones[client.zone];

        if(thisZone != null && thisZone.clients != null){
            for(let c of thisZone.clients){

                if(excludeClient && c == client) continue;
                c.ws.send(data, function (error){
                    //if(error) console.log(error+"\r\n"); //Removed message error to stop crashing
                });
            }
        }
    }

    //Adds a client to the zone on the SERVER ONLY
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

    //Removes a client from the zone on the SERVER ONLY
    RemoveClientFromZone = function(client,zone){

        let errorStr = "Tried to remove client from zone that does not exist!";
        if(this.zones[zone] == null){
            Debug.Log(errorStr, "red");
            return;
        }
        if(this.zones[zone].clients == null){
            Debug.Log(errorStr, "red");
            return;
        }
        let ind = this.zones[zone].clients.indexOf(client);
        if(ind >= 0) this.zones[zone].clients.splice(ind, 1);
    }

    //Causes a client to move from one zone to another, despawning in the zone they left for all other clients.
    ChangeZone(ws, zone, position){
        let client = this.clients[ws.id];

        if(client.zone != null){
            this.RemoveClientFromZone(client, client.zone);

            //tell other clients to despawn this player from zone
            this.BroadcastDataZone(ws, {
                cmd: 'despawn',
                id: client.id
            });
        }

        this.AddClientToZone(client, zone);
        client.position = position;

        this.SendData(ws, {
            cmd: 'setUser',
            id: ws.id,
            user: client.username,
            position: client.position,
            zone: client.zone
        });
        //tell this client to spawn other players as pawns
        this.PopulateClientsInZone(ws, client.zone);

        //tell other clients to spawn this player as a pawn
        this.BroadcastDataZone(ws, {
            cmd: 'populate',
            id: client.id,
            user: client.username,
            position: client.position
        });
    }

    //Start an instance game with a unique zone identifier
    //(eg. Instanced zones: id-w627srrpzid / Static zones: 1-99999),
    //ID is returned so it can be provided by other clients trying to join the same instance
    StartInstancedGame(client, zoneID=null){
        if(zoneID == null){
            zoneID = Util.uniqueId();
        }
        if(this.zones[zoneID] == null){
            this.zones[zoneID] = {};
        }
        if(this.zones[zoneID].clients == null){
            this.zones[zoneID].clients = [];
        }
        if(client.zone != null) {
            client.worldZone = client.zone;
            this.RemoveClientFromZone(client, client.zone);
        }
        this.AddClientToZone(client, this.zones[zoneID]);

        return zoneID;
    }

    //Tells the client to spawn all other players
    PopulateClientsInZone(ws,zone){
        let client = this.clients[ws.id];
        let thisZone = this.zones[zone];

        for(let c of thisZone.clients){

            if(client == c) continue;

            this.SendData(ws, {
                cmd: 'populate',
                id: c.id,
                user: c.username,
                position: c.position
            });
        }
    }
}

export default (new WebsocketManager);