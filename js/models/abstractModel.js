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
  this._addCommentEvent = new common.Event(this);
};

models.AbstractModel.errorFn = common.helpers.virtualErrorFn;

// model.initialize(FB,userId); [async]
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
 * model.attachToAddCommentEvent(eventHandlerFn :function)
 * Causes eventHandlerFn to be called whenever a notification happens
 * on the _addCommentEvent. No parameters are passed to the eventHandlerFn
 * instead, the event handler should make suitable api calls to get data
 */ 
models.AbstractModel.prototype.attachToAddCommentEvent =
    models.AbstractModel.errorFn;

/**
 * icon=model.getOpenIcon(), icon is of type common.IconNode
 * returns the currently open icon (not its children but the icon
 * which is currently open)
 */ 
models.AbstractModel.prototype.getOpenIcon = models.AbstractModel.errorFn;

/**
 * iconArray=model.getParentIcons(), iconArray is array of type common.IconNode
 * returns an array of icons, tracing the path from the 'home' icon, down
 * to the current icon. This function is useful for the navigation bar
 * as the contents of the returned array are exactly the ones to be put
 * in iconArray
 * Can also assert(iconArray[iconArray.length-1]=model.getOpenIcon();
 * i.e, the last entry in this iconArray is the currently open icon.
 */ 
models.AbstractModel.prototype.getCurrentPathIcons =
    models.AbstractModel.errorFn;

 
/**
 * iconArray=model.getCurrentIcons(), iconArray is array of common.IconNode
 * Will return an array of icons in the currently open directory in the model
 * if the model is pointing to a specific photo (a leaf node), this should error
 */ 
models.AbstractModel.prototype.getCurrentIcons = models.AbstractModel.errorFn;

/**
 * photo=model.getCurrentPhoto(), photo is object of type common.PhotoObj
 * returns a photo object, if the model is pointing to a photo
 * else if it is pointing to a directory, then it errors
 */
models.AbstractModel.prototype.getCurrentPhoto = models.AbstractModel.errorFn;

/**
 * model.addComment(message :string) [async]
 * Adds a comment to the currently open photo (errors if not viewing
 * a photo). This function raises the commentAddedEvent
 * TODO: If comment adding was not successful, somehow need to inform
 * of that also.
 */
models.AbstractModel.prototype.addComment = models.AbstractModel.errorFn;

/**
 * commentObj=model.getLastPostedComment() 
 * Returns the last comment on the photo. Is useful when a comment has
 * just been added and needs to be retrieved.
 */
models.AbstractModel.prototype.getLastPostedComment =
    models.AbstractModel.errorFn;

/**
 * userName=model.getUserName()
 * Returns full name of current user 
 */
models.AbstractModel.prototype.getUserName = models.AbstractModel.errorFn;

/**
 * Function to close the photo, will not raise any open folder event
 */
models.AbstractModel.prototype.closeCurrentPhoto = models.AbstractModel.errorFn;

/**
 * model.gotoIcon(targetIcon :common.IconNode) [async]
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
