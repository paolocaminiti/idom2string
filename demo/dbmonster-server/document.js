var IncrementalDOM = require('../../index.js')

/*
	Mock document objects and makes body an idom descrpitor to wrap the app
*/
var document = {
	doctype: function () {
		IncrementalDOM.text('<!doctype html>')
	},
	head: function () {
		//document.doctype()
		IncrementalDOM.elementOpen('head')
			IncrementalDOM.elementVoid('link', null, [
				'href', '//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css',
				'rel', 'stylesheet',
				'type', 'text/css'
			])
			IncrementalDOM.elementVoid('link', null, [
				'href', '//localvoid.github.io/idom-dbmonster/styles.css',
				'rel', 'stylesheet',
				'type', 'text/css'
			])
		IncrementalDOM.elementClose('head')
	},
	body: function (partial) {
		document.head()
		IncrementalDOM.elementOpen('body')
			partial()
			// script comes later to allow first render while streaming
			IncrementalDOM.elementOpen('script', null, [
				'src', '//localvoid.github.io/idom-dbmonster/main.js'
			])
			IncrementalDOM.elementClose('script')
		IncrementalDOM.elementClose('body')
	},
	getElementById: function (id) {
		return this.elementById[id]
	},
	elementById: {}
}

module.exports = document