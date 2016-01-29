var fs = require('fs')
var http = require('http')

var IncrementalDOM = require('../../index.js')
var app = require('./main.js')


/*
	Add a slash before a commented block to pick an example
	Hit a request on localhost:port
	Throttle the connection to see it in action
*/
var requestListener = function (req, res) {
	res.writeHead(200)

	if (req.url === '/favicon.ico') return res.end()

	/* http streaming, this is penalized by link tags in the head
	IncrementalDOM.setOutput(false, res, function (out) {
		console.log('patch stream done > end response')
		out.end()
	})
	app()
	//*/

	//* render then send in callback
	IncrementalDOM.setOutput(false, {}, function (out) {
		console.log('patch render done > write response')
		res.end(out.rendered)
	})
	app()
	//*/

	/* render then send by reference
	var out = {}
	IncrementalDOM.setOutput(false, out)
	app()
	console.log('patch render done > write response from ref')
	res.end(out.rendered)
	//*/

	/* from cached file
	try {
		fs.accessSync('index.html.cache')
		var data = fs.readFileSync('index.html.cache').toString()
		res.end(data)
	} catch (e) {
		IncrementalDOM.setOutput('\t', fs.createWriteStream('index.html.cache'), function (out) {
			out.on('finish', function () {
				var data = fs.readFileSync('index.html.cache').toString()
				res.end(data)
			})
			out.end()
		})
		app()
	}
	//*/
}


var server = http.createServer(requestListener)
var port = 8080
server.listen(port)
console.log('localhost:' + port)