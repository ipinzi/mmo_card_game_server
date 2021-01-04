import Command from "./command.js";
import WebsocketManager from "../websocket.js";

class Teleport extends Command{
    constructor() {
        super();
        this.cmd = "teleport";
    }

    RunCommand(ws, data) {
        let zone = data.zone;
        let position = {
            x: data.x,
            y: data.y,
            z: data.z
        }

        WebsocketManager.ChangeZone(ws, zone, position);
    }
}
export default Teleport;