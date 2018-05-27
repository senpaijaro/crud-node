'use strict';
const bluebird = require('bluebird');
const mysql = require('mysql2/promise');
const mysql_ =require('mysql');
const Promise = require('promise');
const _ = require('underscore');
const trim = require('trim');
const myConnection = require('express-myconnection');

let conn = {
	host: "localhost",
	user: "root",
	password: "password!@#$",
	database: "test",
} 

const connection = mysql_.createConnection(conn)
const db = bluebird.promisifyAll(connection)

class Database{

	constructor(){
		this.db = db;
	}
	
	async transactionBegin(){
		await db.beginTransactionAsync()
		return db
	}

	async commit_(transaction){
		return await transaction.commitAsync()
	}

	async myselect_(table,fields='*'){
		let query = `SELECT ${fields} FROM ${table}`;
		try{
			let res = await this.db.queryAsync(query)
			return res;
		}catch(err){
			return false;
		}
	}

	async myinsert_(table,data){
		let set = [],fields = [], values = [];
		await _.each(data, function (val,ind){
			fields.push(ind);
			set.push('?');
			values.push(val);
		});
		let query = `INSERT INTO ${table} (${fields.join(',')}) VALUES (${set}) `;
		try{
			let res = await this.db.queryAsync(query,values);
			return res;
		}catch(error) {
			db.rollbackAsync();
			return false
		}
	}

	async myupdate_(table,data,condition){
		let index = [], fields = [], values = [], where = [];
		await _.each(data, function(val,ind){
			fields.push(ind + ' = ?');
			values.push(trim(val.toString()));
		});
		await _.each(condition, function(val, ind){
			  where.push(ind + ' = ?');
			  values.push(trim(val.toString()));
		});
		try {
			let query = `UPDATE ${table} SET ${fields} WHERE ${where.join(' AND ')}`;
			let res = await this.db.queryAsync(query,values)
			return res;
		} catch (error) {
			console.log(error);
			return false;
		}
	}

	async mydelete_(table,condition,transaction=null){
		let where =[], values = [];
		await _.each(condition, function(val, ind){
			where.push(ind + ' = ?');
			values.push(val);
		  });
		try{
			let query = `DELETE FROM ${table} WHERE ${where.join(' AND ')}`;
			let res = await this.db.queryAsync(query,values);
			return res;
		}catch(err){
			console.log(err);
			return false;
		}
	}

	async queryms(){

	}


}

module.exports = Database;