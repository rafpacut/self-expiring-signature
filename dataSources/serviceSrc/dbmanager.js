const fs = require('fs');
const {Client} = require('pg');

class DbManager
{
	constructor(){
		let configJSON = fs.readFileSync('./db.conf');
		let config = JSON.parse(configJSON);

		this.client = new Client(config);
		this.client.connect();
	}

	async execQuery(queryText, values){
		//parametrized query is auto-sanitized by sql server
		console.log(queryText);
		console.log(values);
		let result;
		try {
			result = await this.client.query(queryText, values);
		} catch (err) {
			if(err.code=="23505"){
				throw `Signature with this id already exists`;
			}
			throw err;
		}
		return result;
	}

	async addData(id, data){
		const queryText = 'INSERT INTO signaturedata ("signatureid", "data") VALUES ($1, $2)';
		const values = [id, data];
		let result;
		try{
			result = this.execQuery(queryText, values);
		}catch(e){
			console.error(e);
			throw e;
		}
		return result;
	}

	async getData(id){
		const queryText = 'SELECT data, timestamp FROM signaturedata WHERE signatureid=$1';
		let result = await this.execQuery(queryText, id);
		return result.rows;
	}
}

module.exports = DbManager;
