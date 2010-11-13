/**
 * This file implements an interface to the view class, so that the skeleton
 * of the class can be seen quickly, without knowing the implementation details
 */

goog.provide(views.AbstractView);

var views.AbstractView = function(abstractModel){
  this._fb = {};
  this._abstractModel = abstractModel;
  // attach listeners
  this._abstractModel.attachToOpenFolderEvent(this.openFolderEventHandler());
  this._abstractModel.attachToOpenPhotoEvent(this.openPhotoEventHandler());

}

// TODO: We should probably move this to a common area
views.AbstractView.errorFn = function(){
  throw Error('Calling a virtual function not allowed\n');
}

views.AbstractView.prototype.initialize = views.AbstractView.errorFn;

/**
 * views.openFolderEventHandler()
 * Invoked on an openFolder notification from the model. Makes suitable API 
 * API calls to model to get the required info abouth the event.
 */ 
views.AbstractView.prototype.openFolderEventHandler =
    views.AbstractView.errorFn;

/**
 * views.openPhotoEventHandler()
 * Invoked on an openPhoto notification from the model. Makes suitable API 
 * API calls to model to get the required info abouth the event.
 */ 
views.AbstractView.prototype.openPhotoEventHandler =
    views.AbstractView.errorFn;
 
