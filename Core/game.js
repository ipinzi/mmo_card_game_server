import PlayerManager from "./players.js";
import WebsocketManager from "./websocket.js";
import Config from "../config.js";

class Game{

    constructor() {
        this.playerManager = new PlayerManager();
    }

    SpawnPlayer(ws) {

        this.playerManager.LoadPlayerData(ws,(success, data) => {

            let client = WebsocketManager.clients[ws.id];
            if(success){#
                client.position = data.position;
                client.zone = data.zone;
            }else{
                //if we cant load player data for this account that means we are a new player!
                this.CreateNewPlayer(ws);
            }

            WebsocketManager.AddClientToZone(client, client.zone);

            WebsocketManager.SendData(ws, {
                cmd: 'setUser',
                id: ws.id,
                user: client.username,
                position: client.position,
                zone: client.zone
            });
            //tell this client to spawn other players as pawns
            this.PopulateClientsInZone(ws, client.zone);

            //tell other clients to spawn this player as a pawn
            WebsocketManager.BroadcastDataZone(ws, {
                cmd: 'populate',
                id: client.id,
                user: client.username,
                position: client.position
            });
        });
    }
    DespawnPlayer(ws){
        let client = WebsocketManager.clients[ws.id];
        this.playerManager.SavePlayerData(ws);
        WebsocketManager.RemoveClientFromZone(client, client.zone);
    }
    PopulateClientsInZone(ws,zone){
        let client = WebsocketManager.clients[ws.id];
        let thisZone = WebsocketManager.zones[zone];

        for(let c of thisZone.clients){

            if(client == c) continue;

            WebsocketManager.SendData(ws, {
                cmd: 'populate',
                id: c.id,
                user: c.username,
                position: c.position
            });
        }
    }

    CreateNewPlayer(ws) {
        let client = WebsocketManager.clients[ws.id];
        client.position = Config.start_position;
        client.zone = Config.start_zone;
    }
}
export default (new Game);