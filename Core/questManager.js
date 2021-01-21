import ArrogantUtil from "./util.js";
import fs from 'fs';
import path from 'path';
import WebsocketManager from "./websocket.js";
const __dirname = path.resolve();

let rawQuestData = fs.readFileSync(__dirname + '\\data\\questDatabase.json');
const QuestDB = JSON.parse(rawQuestData);

class QuestManager{

    QuestBegin(client, questId){
        //if already on quest then return
        for(let q of client.quests){
            if(q.id == questId) return "Player is already taking this quest";
        }
        let quest = {
            id: questId,
            progress: 0,
        };
        client.quests.push(quest);
    }
    QuestProgressNext(client, questId){
        client.quests[questId].progress ++;
    }
    SendQuestDataToClient(ws, client, type="refresh"){
        let questIDs = [];
        let questProgress = [];

        for(let i=0;i<client.quests.length;i++){
            questIDs[i] = client.quests[i].id;
            questProgress[i] = client.quests[i].progress;
        }

        WebsocketManager.SendData(ws,{cmd: "questsUpdate", type:type, questIds: questIDs, questProgress: questProgress});
    }
    GetQuestFromDB(questId){
        for(let quest of QuestDB.quests){
            if(quest.id == questId){
                return quest;
            }
        }
        return null;
    }
}
/*class Quest{
    constructor(questId,steps) {
        this.id = questId;
        this.steps = [];
        this.progress = 0;
        for(let i=0; i<steps.length,i++){
            this.steps[i] = steps[i];
        }
    }
}
class QuestStep{
    constructor(stepId, nextStepId) {
        this.id = stepId;
        this.nextStepId = nextStepId;
    }
}*/
export default QuestManager;