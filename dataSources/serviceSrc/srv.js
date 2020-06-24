const express = require('express');
const crypto = require('crypto');
const app = express();

const fs = require('fs');

var data = undefined;

function refreshData(){
	data = crypto.randomBytes(32).toString('hex');
	fs.writeFile('./data',data, (err)=>{
		if(err){
			throw err;
		}
	});
}

function readData(){
	try{
		data = fs.readFileSync('./data', 'utf-8');
	}
	catch(err){
		console.error(err);
		refreshData();
	}
}


app.use(express.json());
const port = '80';

app.get('/getData', async (req,res) => {
	if(data === undefined){
		readData();
	}
	res.send(data);
});

const milisecondsInADay = 1000*60*60*24;
setInterval(()=>{
	refreshData();
}, milisecondsInADay);

app.listen(port);
