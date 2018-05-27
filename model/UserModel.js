const database = require('../core/database');

class userModel extends database{

    constructor(){
        super();
        this.table = 'tbluser';
    }
    async insertUser(data){
        let tran = await this.transactionBegin();
            let res = await this.myinsert_('tbluser',data);
        this.commit_(tran);
    }
    
    async listAllUser(){
        let res = await this.myselect_(this.table);
        return res;
    }
}

module.exports = new userModel;