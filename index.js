/*
	IncrementalDOM api mock
*/
function elementOpen() {
	var propertyValuePairs = Array.prototype.slice.call(arguments, 3, arguments.length)

	elementOpenStart(arguments[0], arguments[1], arguments[2])

	if (propertyValuePairs.length > 0) {
		_attrsArray(propertyValuePairs)
	}

	return elementOpenEnd()
}

function elementOpenStart(tagname, key, staticPropertyValuePairs) {
	_push('<' + tagname, true)

	if (staticPropertyValuePairs && staticPropertyValuePairs.length > 0) {
		_attrsArray(staticPropertyValuePairs)
	}
}

function elementOpenEnd() {
	_push('>', false)
	_nestingCount++

	return _elementDummy
}

function elementClose(tagname) {
	_nestingCount--
	_push('</' + tagname + '>', true)

	return _elementDummy
}

function elementVoid() {
	elementOpen.apply(null, arguments)

	return elementClose(arguments[0])
}

function elementPlaceholder() {
	elementOpen.apply(null, arguments)

	return elementClose(arguments[0])
}

function attr(name, value) {
	_push(' ' + name + '="' + value + '"', false)
}

function text(value, formatters) {
	var formatted = value

	for (var i = 1; i < arguments.length; i += 1) {
		formatted = arguments[i](formatted)
	}

	_push('' + formatted, true)
}

function patch(node, description, data) {
	if (typeof node === 'function') {
		node(function () {
			description(data)
		})
	} else {
		description(data)
	}

	if (!_isStreamOutput) {
		_output.rendered = _buffer.join('')

		// the following two line are in browser fun only (usefull for testing)
		// console.log(_output.rendered)
		if (node.innerHTML) node.innerHTML = _output.rendered
	}

	if (_doneCallback) _doneCallback(_output)

	if (!_keepOpen) _reset()
}

/*
	Internal methods
*/
function _attrsArray(attrsArray) {
	for (var i = 0; i < attrsArray.length; i += 2) {
		attr(attrsArray[i], attrsArray[i + 1])
	}
}

function _nestingSpace() {
	return Array(_nestingCount).join(_prettyPrint)
}

function _push2Array(token, needsFormatting) {
	if (_prettyPrint && needsFormatting) {
		_buffer.push('\n')
		_buffer.push(_nestingSpace())
		_buffer.push(token)
	} else {
		_buffer.push(token)
	}
}

function _push2Stream(token, needsFormatting) {
	if (_prettyPrint && needsFormatting) {
		_output.write('\n')
		_output.write(_nestingSpace())
		_output.write(token)
	} else {
		_output.write(token)
	}
}

function _reset() {
	setOutput()
	_buffer = []
	_nestingCount = 1
}

/*
	Configuration api
*/
function setOutput(prettyPrint, output, doneCallback, keepOpen) {
	_prettyPrint = prettyPrint
	_output = output ? output : {}
	_isStreamOutput = output && output.write ? true : false
	_doneCallback = typeof doneCallback === 'function' ? doneCallback : undefined
	_keepOpen = keepOpen

	if (_isStreamOutput) {
		_push = _push2Stream
	} else {
		_push = _push2Array
	}
}

function setElementDummy(obj, merge) {
	if (merge) {
		Object.assign(_elementDummy, obj)
	} else {
		_elementDummy = obj
	}
}

/*
	Internal state
*/
var _elementDummy = {
	addEventListener: function () {}
}

var _prettyPrint;
var _output;
var _isStreamOutput;
var _doneCallback;
var _keepOpen;

var _buffer;
var _nestingCount;

var _push;

_reset()


module.exports =  {
	// IncrementalDOM api mock
	elementOpen: elementOpen,
	elementOpenStart: elementOpenStart,
	elementOpenEnd: elementOpenEnd,
	elementClose: elementClose,
	elementVoid: elementVoid,
	elementPlaceholder: elementPlaceholder,
	attr: attr,
	text: text,
	patch: patch,

	// Configuration api
	forceReset: _reset,
	setOutput: setOutput,
	setElementDummy: setElementDummy
}