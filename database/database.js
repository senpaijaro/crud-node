'use strict';
const mysql = require('mysql2/promise');
const Promise = require('promise');
const bluebird = require('bluebird');
const _ = require('underscore');
const trim = require('trim');
const myConnection = require('express-myconnection');

let conn = {
	host: "localhost",
	user: "root",
	password: "password!@#$",
	database: "test",
} 

class Database{

	constructor(){
		this.conn = conn;
	}

	async query(query,parameters=null) {
		try{
		  let connection = await mysql.createConnection(this.conn);
		  const [rows, fields] = await connection.execute(query, parameters);
		  connection.destroy();
		  return await rows;
		} catch(e){
			console.log(e);
			return [];
		}
	} 

	async execute(query=null,parameters=null){
		return  await this.query(query,parameters);
	}

	async select_(table,fields='*'){
		let query = `SELECT ${fields} FROM ${table}`;
		let res = await this.execute(query)
	}

	async insert_(table,data){
		let set = [],fields = [], values = [];
		await _.each(data, function (val,ind){
			fields.push(ind);
			set.push('?');
			values.push(val);
		});
		let query = `INSERT INTO ${table} (${fields.join(',')}) VALUES (${set}) `;
		let res = await this.execute(query,values);
		console.log(res)
	}

	async update_(table,data,condition){
		let index = [], fields = [], values = [], where = [];
		await _.each(data, function(val,ind){
			fields.push(ind + ' = ?');
			values.push(trim(val.toString()));
		});
		await _.each(condition, function(val, ind){
			  where.push(ind + ' = ?');
			  values.push(trim(val.toString()));
		});
		let query = `UPDATE ${table} SET ${fields} WHERE ${where.join(' AND ')}`;
		console.log(query);
	}
}

module.exports = Database;