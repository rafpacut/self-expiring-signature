const express = require('express');
const mcl = require('mcl-wasm');
const crypto = require('crypto');
const DbManager = require('./dbmanager.js');
const dbmanager = new DbManager();
const app = express();





app.use(express.json());
const port = '80';

mcl.init(mcl.BLS12_381).then(()=>{

	app.get('/getData/:signatureID', async (req,res) => {
		let sigID = req.params.signatureID;
		let sigData = await dbmanager.getData(sigID);
		if(sigData.length > 0){
			res.send(sigData);
		}
		res.status(204).end();
	});

	app.post('/setData', async (req,res) => {

		let sigID = req.body.signatureID;
		let randomData = crypto.randomBytes(32).toString('hex');
		let result;
		try{
			result = await dbmanager.addData(sigID, randomData);
		}catch(e){
			res.status(204).end(`Signature with id ${sigID} already exists`);
			return;
		}
		console.log(result);
		res.status(200).send(randomData);
	});

	app.listen(port);
});
