/**
 * This file implements an interface to the model class, so that the skeleton
 * of the class can be seen quickly, without knowing the implementation details
 */

goog.provide('models.AbstractModel');

goog.require('common.helpers');
goog.require('common.Event');

models.AbstractModel = function(){
  this.fb = {};
  this._openFolderEvent = new common.Event(this);
  this._openPhotoEvent = new common.Event(this);
};

models.AbstractModel.errorFn = common.helpers.virtualErrorFn;

// model.initialize(FB,userId);
models.AbstractModel.prototype.initialize = models.AbstractModel.errorFn;

/**
 * model.attachToOpenFolderEvent(eventHandlerFn :function)
 * Causes eventHandlerFn to be called whenever a notification happens
 * on the _openFolderEvent. No parameters are passed to the eventHandlerFn
 * instead, the event handler should make suitable api calls to get data
 */ 
models.AbstractModel.prototype.attachToOpenFolderEvent =
    models.AbstractModel.errorFn;

/**
 * model.attachToOpenPhotoEvent(eventHandlerFn :function)
 * Causes eventHandlerFn to be called whenever a notification happens
 * on the _openPhotoEvent. No parameters are passed to the eventHandlerFn
 * instead, the event handler should make suitable api calls to get data
 */ 
models.AbstractModel.prototype.attachToOpenPhotoEvent =
    models.AbstractModel.errorFn;
 
/**
 * iconArray=model.getCurrentIcons(), iconArray is array of common.IconNode
 * Will return an array of icons in the currently open directory in the model
 * if the model is pointing to a specific photo (a leaf node), this should error
 */ 
models.AbstractModel.prototype.getCurrentIcons = models.AbstractModel.errorFn;

/**
 * photo=model.getCurrentPhoto(), photo is object of type common.PhotoNode
 * returns a photo object, if the model is pointing to a photo
 * else if it is pointing to a directory, then it errors
 */
models.AbstractModel.prototype.getCurrentPhoto = models.AbstractModel.errorFn;

/**
 * model.gotoIcon(targetIcon :common.IconNode)
 * This api call causes model to open a particular icon. Depending on the
 * status of the icon (whether leaf or directory), this can either cause a
 * _openFolderEvent, or a _openPhotoEvent to be notified.
 */
models.AbstractModel.prototype.gotoIcon = models.AbstractModel.errorFn;

/**
 * model.getNumberOfFriends()
 * Gets the number of friends of the current user. Model  probably should store
 * this when it initializes
 */
models.AbstractModel.prototype.getNumberOfFriends
     = models.AbstractModel.errorFn;

/**
 * model.getNumberOfAlbums()
 * Gets the number of albums of the user (not friends).
 */
models.AbstractModel.prototype.getNumberOfAlbums
     = models.AbstractModel.errorFn;
