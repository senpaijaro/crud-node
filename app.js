const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const bluebird = require('bluebird'); 
const Promise = require('promise');
const _ = require('underscore');
const compose = require('compose-middleware').compose;
const User =  require('./controller/userController');
const requireAll = require('require.all');

const routes = require('./core/routes');
const policy = require('./core/policies');

//app set here
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let controllers = requireAll({
	dir: './controller',
  	match: /Controller\.js$/i, //only files that end with 'controller.js' 
  	recursive: false,
  	map: (name, path, isFile) => requireAll.map(name, path, isFile).replace(/Controller$/i, '')
}),

policies = requireAll({
	dir: './Policies',
  	match: /Policy\.js$/i, //only files that end with 'controller.js' 
});

_.each(routes, function(value, index){
	let getApi = index.split(" "),
		path = value.split("."),
		middleware = [];
		
		_.each(policy["policies"], function(val, ind){
			if(path[0] == ind && path[1] in val){
				middleware = val[path[1]];
				return false;
			}
		});

		_.each(middleware, function(val, ind){
			if(val.indexOf("Policy") > -1 ){
				middleware[ind] = policies[val];
			}
		});
		
		middleware.push(controllers[path[0]][path[1]]);
		if(getApi[0] === "GET"){
			app.get(getApi[1], compose(middleware));
		}else if (getApi[1] === "POST"){
			app.post(getApi[1]);
		}
});

app.listen(4000, function(){
	console.log('running port 4000');
});