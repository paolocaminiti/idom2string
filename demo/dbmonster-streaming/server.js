var fs = require("fs")
var http = require('http')

var IncrementalDOM = require('../../index.js')
var app = require('./main.js')


/*
	Set the desired output then hit a request on localhost:port
*/
var requestListener = function (req, res) {
	res.writeHead(200)

	// http response
	IncrementalDOM.setOutput(false, res, null, true)

	// stdout
	//IncrementalDOM.setOutput('  ', process.stdout, null, true)

	// file
	//IncrementalDOM.setOutput('\t', fs.createWriteStream('index.html.cache'), null, true)

	app()
}


var server = http.createServer(requestListener)
var port = 8080
server.listen(port)
console.log('localhost:' + port)