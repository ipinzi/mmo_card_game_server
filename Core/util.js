import util from "util";
import Debug from "./debugger.js";

class ArrogantUtil{
    //Possibly no longer necessary in ES6 as ==null seems to work just as well now
    IsDefined(variable){

        if(typeof variable === 'undefined' || variable === null){
            return false;
        }else{
            return true;
        }
    }
    //Calculates size of bytes
    BytesToSize(bytes) {
        let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Bytes';
        let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }
    LogMemoryUsage(){

        let rss = process.memoryUsage().rss;
        let heapUsed = process.memoryUsage().heapUsed;
        let heapTotal = process.memoryUsage().heapTotal;
        let ext = process.memoryUsage().external;
        Debug.Log("Memory Usage",'yellow', 'underline');
        Debug.Log("Heap Used: "+this.BytesToSize(heapUsed), 'yellow');
        Debug.Log("Heap Total: "+this.BytesToSize(heapTotal), 'yellow');
        Debug.Log("External: "+this.BytesToSize(ext), 'yellow');
        Debug.Log("Total Memory Used: "+this.BytesToSize(rss), 'yellow');
        Debug.Log("======================================","green");
    }
    //Generates a unique identifier
    uniqueId() {
        return 'id-' + Math.random().toString(36).substr(2, 16);
    };
}
export default (new ArrogantUtil);