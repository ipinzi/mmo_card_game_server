import * as CommandList from './CommandList.js';

class CommandInterpreter {
    constructor(engine) {
        this.engine = engine;
        this.modules = CommandList.Commands;
        this.commands = [];

        for(let i=0;i<this.modules.length;i++){
            this.commands[i] = new this.modules[i](engine);
        }
    }
    InterpretCommand(ws, cmd, data){
        for(let i=0;i<this.commands.length;i++){
            if(this.commands[i].TryRunCommand(ws, cmd, data)) return true;
        }
        console.log('That is not a valid command.');
    }
}
export default CommandInterpreter;