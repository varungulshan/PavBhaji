/**
 * This file implement a simple Event class, taken from the javascript MVC
 * tutorial at: 
 * http://www.alexatnet.com/content/model-view-controller-mvc-javascript
 */

goog.provide(common.Event);

common.Event = function (sender) {
    this._sender = sender;
    this._listeners = [];
};
 
common.Event.prototype = {
    attach : function (listener) {
        this._listeners.push(listener);
    },
    notify : function (args) {
        for (var i = 0; i < this._listeners.length; i++) {
            this._listeners[i](args);
        }
    }
};
