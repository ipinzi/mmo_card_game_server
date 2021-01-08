import WebsocketManager from "./websocket.js";
import fs from 'fs';
import path from 'path';
const __dirname = path.resolve();

let rawCardData = fs.readFileSync(__dirname + '\\Core\\data\\cardDatabase.json');
const CardDB = JSON.parse(rawCardData);

class CardManager{

    CardAddToPlayer(client, cardId){
        client.cards.push(cardId);
    }
    DeckCreate(name){
        return {
            deckName: name,
            cards: []
        };
    }
    DeckAddToPlayer(client, deck){
        client.decks.push(deck);
    }
    CardAddToDeck(client, deck, cardId){
        let deckIndex = client.decks.indexOf(deck);
        if(client.decks[deckIndex] == null){
            deck.cards.push(cardId);
            return;
        }
        client.decks[deckIndex].cards.push(cardId);
    }
    GetCardFromDB(cardId){
        for(let card of CardDB.cards){
            if(card.id == cardId){
                return card;
            }
        }
        return null;
    }
}
export default CardManager;