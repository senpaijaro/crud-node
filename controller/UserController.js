const UserModel = require('../model/UserModel');
class Controller {

    constructor(){
    }

    async listAllUser(req, res){
        let result = await UserModel.listAllUser();     
        res.render('index',{
            data: result
        });
    }
}

module.exports = new Controller();