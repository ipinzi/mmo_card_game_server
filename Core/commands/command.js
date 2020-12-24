class Command {

    constructor(){
        this.cmd = "";
    }

    TryRunCommand(ws, cmd, data){

        if(cmd == this.cmd){
            this.RunCommand(ws,data);
            return true;
        }
        return false;
    }
    RunCommand(ws,data){
        console.log("Trying to run an empty command!");
        return true;
    }

}
export default Command;