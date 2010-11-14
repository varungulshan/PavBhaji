/**
 * This file implements an interface to the view class, so that the skeleton
 * of the class can be seen quickly, without knowing the implementation details
 */

goog.provide(view.AbstractView);

var view.AbstractView = function(abstractModel){
  this._fb = {};
  this._abstractModel = abstractModel;
  // attach listeners
  this._abstractModel.attachToOpenFolderEvent(this.openFolderEventHandler());
  this._abstractModel.attachToOpenPhotoEvent(this.openPhotoEventHandler());

}

// TODO: We should probably move this to a common area
view.AbstractView.errorFn = function(){
  throw Error('Calling a virtual function not allowed\n');
}

view.AbstractView.prototype.initialize = view.AbstractView.errorFn;

/**
 * view.openFolderEventHandler()
 * Invoked on an openFolder notification from the model. Makes suitable API 
 * API calls to model to get the required info abouth the event.
 */ 
view.AbstractView.prototype.openFolderEventHandler =
    view.AbstractView.errorFn;

/**
 * view.openPhotoEventHandler()
 * Invoked on an openPhoto notification from the model. Makes suitable API 
 * API calls to model to get the required info abouth the event.
 */ 
view.AbstractView.prototype.openPhotoEventHandler =
    view.AbstractView.errorFn;
 
