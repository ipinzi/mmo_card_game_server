import PlayerManager from "./players.js";
import WebsocketManager from "./websocket.js";
import Config from "../config.js";
import CardManager from "./cardManager.js";
import QuestManager from "./questManager.js";

class Game{

    constructor() {
        this.playerManager = new PlayerManager();
        this.cardManager = new CardManager();
    }

    //Spawns a new player (on login)
    SpawnPlayer(ws) {

        this.playerManager.LoadPlayerData(ws,(success, data) => {

            let firstLogin = false;
            if(data.position == null && data.zone == null & data.money == null && data.inventory == null){
                firstLogin = true;
            }

            let client = WebsocketManager.clients[ws.id];
            client.position = this.LoadOrDefault(data.position, Config.start_position);
            client.zone = this.LoadOrDefault(data.zone, Config.start_zone);
            client.money = this.LoadOrDefault(data.money, Config.start_money);
            client.inventory = this.LoadOrDefault(data.inventory, []);
            client.cards = this.LoadOrDefault(data.cards, []);
            client.decks = this.LoadOrDefault(data.decks, []);
            client.quests = this.LoadOrDefault(data.quests, []);

            if(firstLogin){
                this.DoNewPlayerStuff(client);
            }

            WebsocketManager.ChangeZone(ws, client.zone, client.position);
            WebsocketManager.SendData(ws,{
                cmd: "moneyUpdate",
                money: client.money
            });
            WebsocketManager.SendData(ws,{
                cmd: "cardsUpdate",
                cards: client.cards
            });
            WebsocketManager.SendData(ws,{
                cmd: "decksUpdate",
                decks: client.decks
            });
            WebsocketManager.SendData(ws,{
                cmd: "inventoryUpdate",
                inventory: client.inventory
            });

            let questMan = new QuestManager();
            questMan.SendQuestDataToClient(ws,client,"refresh");
        });
    }
    LoadOrDefault(data,_default){
        if(data == null){
            return _default;
        } else {
            return data;
        }
    }
    DoNewPlayerStuff(client){
        this.cardManager.CardAddToPlayer(client,"922da951-928c-4eb2-b857-177097f7e613");

        let deck1 = this.cardManager.DeckCreate("Deck One");
        this.cardManager.DeckAddToPlayer(client,deck1);
        this.cardManager.CardAddToDeck(client,deck1,"922da951-928c-4eb2-b857-177097f7e613");
        this.cardManager.CardAddToDeck(client,deck1,"922da951-928c-4eb2-b857-177097f7e613");
        this.cardManager.CardAddToDeck(client,deck1,"922da951-928c-4eb2-b857-177097f7e613");

        let deck2 = this.cardManager.DeckCreate("Deck TWO");
        this.cardManager.DeckAddToPlayer(client,deck2);
        this.cardManager.CardAddToDeck(client,deck2,"922da951-928c-4eb2-b857-177097f7e613");
        this.cardManager.CardAddToDeck(client,deck2,"922da951-928c-4eb2-b857-177097f7e613");
    }
    //Tells all other clients to despawn the player
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
}
export default (new Game);