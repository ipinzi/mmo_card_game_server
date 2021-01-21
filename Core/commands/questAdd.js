import Command from "./command.js";
import WebsocketManager from "../websocket.js";
import QuestManager from "../questManager.js";

class QuestAdd extends Command{
    constructor() {
        super();
        this.cmd = "questAdd";
    }

    RunCommand(ws, data) {
        let client = WebsocketManager.clients[ws.id];

        //if player not in correct zone do not allow quest add
        if(client.zone != data.playerZone) return "Player not in correct zone";

        //if already on quest then return
        for(let q of client.quests){
            if(q.id == data.questID) return "Player is already taking this quest";
        }

        let questMan = new QuestManager();
        questMan.QuestBegin(client, data.questID);

        questMan.SendQuestDataToClient(ws,client,"add");
    }
}
export default QuestAdd;