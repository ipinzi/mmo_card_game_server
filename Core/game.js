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
            if(success){
                client.position = data.position;
                client.zone = data.zone;
            }else{
                //if we cant load player data for this account that means we are a new player!
                this.CreateNewPlayer(ws);
            }

            WebsocketManager.ChangeZone(ws, client.zone, client.position);
        });
    }
    DespawnPlayer(ws){
        let client = WebsocketManager.clients[ws.id];
        this.playerManager.SavePlayerData(ws);
        WebsocketManager.RemoveClientFromZone(client, client.zone);

        //tell other clients to spawn this player as a pawn
        WebsocketManager.BroadcastDataZone(ws, {
            cmd: 'despawn',
            id: client.id
        });
    }

    CreateNewPlayer(ws) {
        let client = WebsocketManager.clients[ws.id];
        client.position = Config.start_position;
        client.zone = Config.start_zone;
    }
}
export default (new Game);