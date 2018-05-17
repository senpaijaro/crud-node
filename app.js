const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
 
const database = require('./database/database.js');
const conn = new database();


var  select =  conn.select_('tbluser');
var details = {
	tfname :'Jadesss',
	tlname : 'OOPsss'
}
 conn.update_('tbluser',details,{id:77});

app.listen(4000, function(){
	console.log('running port 4000');
});