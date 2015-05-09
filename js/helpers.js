'use strict;'

/**
 * Creates a sticky warning message
 * @param  String message   What the error message is going to say
 * @param  String serverUrl Url to check if it is down
 */
function createErrorMessage(message, serverUrl) {
    var newDiv = document.createElement('div');
    var newContent = document.createTextNode(message + ' ');
    var downForEveryone = document.createElement('a');
    downForEveryone.setAttribute('href', 'http://www.isup.me/' + serverUrl);
    var linkText = document.createTextNode('Maybe their servers are down?');
    newDiv.appendChild(newContent);
    if (serverUrl) {
        downForEveryone.appendChild(linkText);
    }
    newDiv.appendChild(downForEveryone);
    newDiv.className = 'alert-box warning';
    newDiv.setAttribute('data-alert', '');
    // add the newly created element and its content into the DOM
    var messagesDiv = document.getElementById('messages');
    messagesDiv.appendChild(newDiv);
}

/**
 * Escapes the gives string to be treated as a literal string
 * (got from Lea Verou's awesomplete)
 * @param  String s
 * @return String   literal string
 */
function regExpEscape(s) {
    return s.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
}

/**
 * Checks if inputItem is contained in testItem
 * @param  String inputItem  the string to test
 * @param  String testItem   string to test against
 * @return Boolean           if one is contained in the other
 */
function valueMatches(inputItem, testItem) {
    var CASE_INSENSITIVE_MATCHING = 'i';
    return RegExp(regExpEscape(inputItem.trim()), CASE_INSENSITIVE_MATCHING).test(testItem);
}

/**
 * Send an asynchronous request that returns a JSON
 * @param  String url
 * @param  function onSuccessCallback
 * @param  function onErrorCallback
 */
function getJSON(url, onSuccessCallback, onErrorCallback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            var data = JSON.parse(request.responseText);
            onSuccessCallback(data);
        } else {
            onErrorCallback(request.status);
        }
    };
    request.onerror = onErrorCallback;

    request.send();
}

/**
 * Send an asynchronous request
 * @param  String url
 * @param  function onSuccessCallback
 * @param  function onErrorCallback
 */
function ajax(url, onSuccessCallback, onErrorCallback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            var resp = request.responseText;
            onSuccessCallback(resp);
        } else {
            onErrorCallback(request.status);
        }
    };

    request.onerror = onErrorCallback;

    request.send();
}

/**
 * Send an asynchronous cross-domain request that returns a JSON
 * @param  String url
 * @param  function onSuccessCallback
 * @param  function onErrorCallback
 */
function getJSONP(url, onSuccessCallback, onErrorCallback) {
    var script = document.createElement('script'), callbackName = 'jsonp_callback_';
    window[callbackName] = function(data) {
        delete window[callbackName];
        document.body.removeChild(script);
        onSuccessCallback(data);
    };
    script.src = url + (url.indexOf( '?' ) + 1 ? '&' : '?') + 'callback=' + callbackName;
    script.onerror = onErrorCallback;
    document.body.appendChild(script);
}

function htmlDecode(input){
  var e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

/**
 * Remove a class from an element
 * @param  String name class's name
 */
Element.prototype.removeClassName = function(name) {
    if (this.hasClassName(name)) {
        var c = this.className;
        this.className = c.replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
    }
};

/**
 * Returns whether the element has the given class
 * @param  String  name class's name
 * @return Boolean      true if the element has that class
 */
Element.prototype.hasClassName = function(name) {
    return new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)').test(this.className);
};