class Debug{
    Log(message,color,feature){

        let feat = '';
        let col = '';

        switch(feature){
            case "reset":
                feat = "\x1b[0m";
                break;
            case "bold":
                feat = "\x1b[1m";
                break;
            case "dim":
                feat = "\x1b[2m";
                break;
            case "underline":
                feat = "\x1b[4m";
                break;
            case "blink":
                feat = "\x1b[5m";
                break;
            case "reverse":
                feat = "\x1b[7m";
                break;
            case "hidden":
                feat = "\x1b[8m";
                break;
        }
        switch(color){
            case "black":
                col = "\x1b[30m";
                break;
            case "red":
                col = "\x1b[31m";
                break;
            case "green":
                col = "\x1b[32m";
                break;
            case "yellow":
                col = "\x1b[33m";
                break;
            case "blue":
                col = "\x1b[34m";
                break;
            case "magenta":
                col = "\x1b[35m";
                break;
            case "cyan":
                col = "\x1b[36m";
                break;
            case "white":
                col = "\x1b[37m";
                break;
        }

        if(color === undefined && feature === undefined){
            console.log(message+"\x1b[30m\x1b[0m");
        }else if(color === undefined){
            console.log(feat+message+"\x1b[30m\x1b[0m");
        }else if(feature === undefined){
            console.log(col+message+"\x1b[30m\x1b[0m");
        }else{
            console.log(col+feat+message+"\x1b[30m\x1b[0m");
        }

        /*BgBlack = "\x1b[40m"
        BgRed = "\x1b[41m"
        BgGreen = "\x1b[42m"
        BgYellow = "\x1b[43m"
        BgBlue = "\x1b[44m"
        BgMagenta = "\x1b[45m"
        BgCyan = "\x1b[46m"
        BgWhite = "\x1b[47m"*/
    }
}
export default(new Debug);