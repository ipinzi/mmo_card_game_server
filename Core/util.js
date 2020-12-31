class Utility{

    IsDefined = function(variable){

        if(typeof variable === 'undefined' || variable === null){
            return false;
        }else{
            return true;
        }
    }
    BytesToSize=function(bytes) {
        let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Bytes';
        let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }
}
export default Utility;