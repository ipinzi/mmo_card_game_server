import Config from "../card_mmo_server/config.js";
import Debug from "./Core/debugger.js";
import WebsocketManager from "./Core/websocket.js";
import ServerCommands from "./Core/serverCommands.js";

WebsocketManager.StartServer();

Debug.Log("======================================","green");
Debug.Log(Config.server_name+" Started!","green","underline");
Debug.Log("Server running at: "+Config.ip+":"+Config.port,"blue");
Debug.Log("======================================","green");