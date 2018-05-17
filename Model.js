'use strict';

class Model {
	
	constructor(){
		this.name_ = 'Jade Batal'
	}
	async firstname(){
		return await Promise.resolve(this.name_);
	}
}

module.exports = Model
