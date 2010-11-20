/**
 * This file implement a simple Event class, taken from the javascript MVC
 * tutorial at: 
 * http://www.alexatnet.com/content/model-view-controller-mvc-javascript
 */

goog.provide('common.Event');

goog.require('goog.Timer');

common.Event = function (sender) {
    this._sender = sender;
    this._listeners = [];
};
 
common.Event.prototype = {
    attach : function (listener) {
        this._listeners.push(listener);
    },
    notify : function () {
        var _event=this;
        for (var i = 0; i < this._listeners.length; i++) {
          var iNew = new Number(i);
          var raiseEventFn = function(){
            _event._listeners[iNew.valueOf()]();
          };
          goog.Timer.callOnce(raiseEventFn,0);
        }
    }
};
