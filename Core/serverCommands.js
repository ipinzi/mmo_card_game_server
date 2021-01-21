import WebsocketManager from "./websocket.js";
import Debug from "./debugger.js";
import ArrogantUtility from "./util.js";

class ServerCommands{

    constructor(showPrompt = false) {
        // Get process.stdin as the standard input object.
        let standard_input = process.stdin;

        // Set input character encoding.
        standard_input.setEncoding('utf-8');

        // Prompt user to input data in console.
        if(showPrompt) Debug.Log("Type /help to see list of commands.",'yellow','bold');

        // When user input data and click enter key.
        standard_input.on('data', function (data) {

            data = data.replace(/(\r\n|\n|\r)/gm, "");

            Debug.Log(data,'red');

            switch(data){

                case '/commands':
                case '/help':
                    Debug.Log("==Help Requested==",'magenta','bold');
                    Debug.Log("/exit OR /shutdown - shut down server",'blue','bold');
                    Debug.Log("/test",'blue','bold');
                    Debug.Log("/logmem - log server memory usage",'blue','bold');
                    Debug.Log("===============================",'magenta','bold');
                    break;

                case '/exit':
                case '/shutdown':
                    Debug.Log("Shutdown command received. Shutting down server...",'magenta','bold');
                    process.exit();
                    break;
                case '/zones':
                    Debug.Log("Zones",'magenta','bold');
                    WebsocketManager.zones.forEach((zone,ind)=>{
                       Debug.Log("Zone: "+ind,'blue','bold');
                       if(zone.clients != null){
                           zone.clients.forEach((client,ind)=>{
                               Debug.Log(client.username,'cyan');
                           });
                       }
                    });
                    break;
                case '/logmem':
                    ArrogantUtility.LogMemoryUsage();
                    break;

                case '/test':
                    Debug.Log("Test command executed!",'magenta','bold');
                    break;
                default:
                    Debug.Log('Command ' + data + ' not recognised, please try again.','red','bold');
                    break;
            }
        });
    }
}
export default (new ServerCommands)