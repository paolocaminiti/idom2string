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
			IncrementalDOM.elementOpen('style')
				IncrementalDOM.text(`
					table {
					  font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
					  font-size: 14px;
					  line-height: 1.42857143;
					  color: #333;
					  background-color: #fff;
					}

					#link {
					  position: fixed;
					  top: 0; right: 0;
					  font-size: 12px;
					  padding: 5px 10px;
					  background: rgba(255,255,255,0.85);
					  z-index: 5;
					  box-shadow: 0 0 8px rgba(0,0,0,0.6);
					}

					#link .center {
					  display: block;
					  text-align: center;
					}

					.Query {
					  position: relative;
					}

					.Query:hover .popover {
					  left: -100%;
					  width: 100%;
					  display: block;
					}
				`)
			IncrementalDOM.elementClose('style')
			// this flush any previous body giving the flickering animation streaming in the browser
			IncrementalDOM.elementOpen('script')
				IncrementalDOM.text(`
					document && document.body && (document.body.innerHTML = '')
				`)
			IncrementalDOM.elementClose('script')
		IncrementalDOM.elementClose('head')
	},
	body: function (partial) {
		document.head()
		IncrementalDOM.elementOpen('body')
			partial()
		IncrementalDOM.elementClose('body')
	},
	getElementById: function (id) {
		return this.elementById[id]
	},
	elementById: {}
}

module.exports = document