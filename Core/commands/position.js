import Command from "./command.js";
import WebsocketManager from "../websocket.js";

class Position extends Command{
    constructor() {
        super();
        this.cmd = "pos";
    }

    RunCommand(ws, data) {

        let client = WebsocketManager.clients[ws.id];

        client.position = {
            x: data.x,
            y: data.y,
            z: data.z
        }

        let newData = {};
        newData.cmd = "pos";
        newData.id = ws.id;
        newData.position = client.position;

        WebsocketManager.BroadcastDataZone(ws, newData);
    }
}
export default Position;