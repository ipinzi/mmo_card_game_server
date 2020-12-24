import bcrypt from "bcrypt";

class Encryption{
    EncryptPassword = function(password, callback) {
        bcrypt.genSalt(10, function(err, salt) {
            if (err)
                return callback(err);

            bcrypt.hash(password, salt, function(err, hash) {
                return callback(err, hash);
            });
        });
    };

    ComparePassword = function(plainPass, hashword, callback) {
        bcrypt.compare(plainPass, hashword, function(err, isPasswordMatch) {
            return err == null ?
                callback(null, isPasswordMatch) :
                callback(err);
        });
    };
}
export default Encryption;