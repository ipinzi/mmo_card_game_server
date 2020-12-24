import WebSocket from "ws";
import Config from "../config.js";
import Debugger from "./debugger.js";
import CommandInterpreter from "./commandInterpreter.js";

const Debug = new Debugger();
const cmdInterpreter = new CommandInterpreter();

class WebsocketManager{

    StartServer(){
        const wss = new WebSocket.Server({ port: Config.port });

        wss.on('connection', (ws) => {
            Debug.Log("Client connected: "+ws,"cyan");
            ws.send('Successfully connected to websocket server!');

            ws.on('message', (message) => {
                let msg = JSON.parse(message);
                Debug.Log('client: '+ message, 'yellow', 'dim');
                cmdInterpreter.InterpretCommand(ws, msg.cmd, msg.data);
            });
        });

        //On server close clear the interval from memory
        wss.on('close',()=>{
            clearTimeout(pingInterval);
        });

        //Ping clients to check they are still connected
        const pingInterval = setInterval( () => {
            wss.clients.forEach(function each(ws) {
                if (ws.isAlive === false) return ws.terminate();

                ws.isAlive = false;
                ws.ping(()=>{});
            });
        }, 30000);
    }

    SendData(ws,data){
        data = JSON.stringify(data);
        ws.send(data, (error) => {
            console.log(error);
        });
    }
    BroadcastDataZone(){

    }
    BroadcastDataGlobally(){

    }
}

export default WebsocketManager;