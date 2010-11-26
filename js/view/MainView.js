/**
 * This file implements an interface to the view class, so that the skeleton
 * of the class can be seen quickly, without knowing the implementation details
 *
 * It is useful to think of the this class in a heirarchical structure with
 * MainView at the top and NavbarView, ContextbarView, ImageArrayView, PhotoView
 * at the next level. We should ideally have separate classes for these but
 * there seems to be cyclic dependency between them. For now, we encode this
 * association in function/data name prefixes
 *
 * TODO(Rahul): Refactor viewer into classes
 */

goog.provide('view.MainView');

goog.require('models.AbstractModel');
goog.require('common.IconNode');
goog.require('goog.ui.AnimatedZippy');
goog.require('goog.events.KeyHandler');
goog.require('goog.ui.Tooltip');

view.MainView = function(model){
  this._model = model;
  this._allowedStates = {"home" : 0, "friends" : 1, "all_albums" : 2,
                         "single_album" : 3, "photo" : 4};
  this._state = this._allowedStates.home;
  this._currentIconNode = {};
  this._parentIconNodes = new Array(); // iconNodes leading to current IconNode
  this._childIconNodes = new Array(); // child nodes of curren node
  this._imageArrayToolTips = new Array();
  this._currentPage = 0; // current page index; display 25 at a time
  this._maxImageWidth = 700;
  this._maxImageHeight = 540;
  this._numImageHolders = 25;
  // attach tooltips
  var imageHolders = common.helpers.getElementByTagAndClassName('div',
                                                                'image_holder');
  goog.asserts.assert( imageHolders.length == this._numImageHolders);
  for(var i = 0; i < this._numImageHolders; ++i) {
    this._imageArrayToolTips[i] = new goog.ui.Tooltip(imageHolders[i],'');
  }
  // attach listeners
  var _view = this;
  var openFolderEventHandlerClosure = function () {
    _view.openFolderEventHandler();
  }
  var openPhotoEventHandlerClosure = function () {
    _view.openPhotoEventHandler();
  }
  this._model.attachToOpenFolderEvent(openFolderEventHandlerClosure);
  this._model.attachToOpenPhotoEvent(openPhotoEventHandlerClosure);
  //attach click handlers
  //TODO(Rahul): Implement these via closures
  var imageArrayViewPrevClickHandlerClosure = function () {
    _view.imageArrayViewPrevClickHandler(); 
  }
  var imageArrayViewNextClickHandlerClosure = function () {
    _view.imageArrayViewNextClickHandler(); 
  }
  var closePhotoButtonClickHandlerClosure = function () {
    _view.closePhotoButtonClickHandler(); 
  }
  document.getElementById('prev_button').onclick = 
    imageArrayViewPrevClickHandlerClosure;
  document.getElementById('next_button').onclick = 
    imageArrayViewNextClickHandlerClosure;
  document.getElementById('fullres_photo_close_button').onclick =
    closePhotoButtonClickHandlerClosure;
  //add console zippy
  this._consoleZippy = new goog.ui.AnimatedZippy('console_header_div',
                                                 'console_content_div');
  this._consoleContent = document.getElementById("console_content_div");
  this._consoleHeader = document.getElementById("console_header_div");
  this._commenterColors = new Array("brown","darkblue","darkred",
                               "teal","olive");
  // set up kye handling
  this._keyHandler = new goog.events.KeyHandler(document);
  var handleKeyPressClosure = function(e) {
    _view.handleKeyPress(e);
  }
  goog.events.listen(this._keyHandler,'key', handleKeyPressClosure);
}

// TODO: We should probably move this to a common area
view.MainView.errorFn = function(){
  throw Error('Calling a virtual function not allowed\n');
}

view.MainView.prototype.initialize = view.MainView.errorFn;

/**
 * view.openFolderEventHandler()
 * Invoked on an openFolder notification from the model. Makes suitable API 
 * API calls to model to get the required info abouth the event.
 */ 
view.MainView.prototype.openFolderEventHandler =
    view.MainView.errorFn;

/**
 * view.openPhotoEventHandler()
 * Invoked on an openPhoto notification from the model. Makes suitable API 
 * API calls to model to get the required info abouth the event.
 */ 
view.MainView.prototype.openPhotoEventHandler =
    view.MainView.errorFn;

/**
 * view.closePhotoButtonClickHandler
 * Invoked when a user closes an open photo
 */ 
view.MainView.prototype.closePhotoButtonClickHandler =
    view.MainView.errorFn;

/**
 * view.MainView.updateView()
 * Updates all the parts of the view by making necessary calls once the
 * currentIconNode and states have been updated
 */
view.MainView.prototype.updateView = view.MainView.errorFn;

/**
 *  view.MainView.handleKeyPress(e: event)
 *  handles different key presses
 */
view.MainView.prototype.handleKeyPress = view.MainView.errorFn;
 
//--------------------------------------------------------------------------
// Functions for NavbarView
// -------------------------------------------------------------------------

/**
 * view.MainView.navbarViewUpdate()
 * Updates the navbar based on current state variable and icon node
 */
view.MainView.prototype.navbarViewUpdate = view.MainView.errorFn;

/**
 * view.MainView.navbarClickHandler(idx: integer)
 * Click handler for navbar. idx tells the button pressed
 */
view.MainView.prototype.navbarViewClickHandler = view.MainView.errorFn;

//--------------------------------------------------------------------------
// Function for ContextbarView
// -------------------------------------------------------------------------

/**
 * view.MainView.contextbarViewUpdate()
 * Updates the context bar based on current state and item node
 */
view.MainView.prototype.contextbarViewUpdate = view.MainView.errorFn;

//--------------------------------------------------------------------------
// Function for ImageArrayView
// ------------------------------------------------------------------------

/**
 * view.MainView.imageArrayViewUpdate()
 * Updates the imageArray being displayed
 */

view.MainView.prototype.imageArrayViewUpdate = view.MainView.errorFn;


/**
 * view.MainView.imageArrayViewClickHandler(idx: integer)
 * Handles a click on the imagearray. idx indexes into _childIconNodes
 */
view.MainView.prototype.imageArrayViewClickHandler = view.MainView.errorFn;

/**
 * view.MainView.imageArrayViewNextClickHandler()
 * handles click on the next page button
 */
view.MainView.prototype.imageArrayViewNextClickHandler = view.MainView.errorFn;

/**
 * view.MainView.imageArrayViewPrevClickHandler()
 * handles click on the prevt page button
 */
view.MainView.prototype.imageArrayViewPrevClickHandler = view.MainView.errorFn;

//--------------------------------------------------------------------------
// Functions for ConsoleView
// ------------------------------------------------------------------------

/**
 * view.MainView.consoleViewClose()
 * hides the console view if it is open
 */
view.MainView.prototype.consoleViewClose = view.MainView.errorFn;

/**
 * view.MainView.consoleViewClear()
 *  clears everything from the console view
 */
view.MainView.prototype.consoleViewClear = view.MainView.errorFn;

/** view.MainView.consoleViewAdd(str: string)
 * adds a new div with the content specified by str
 */
view.MainView.prototype.consoleViewAdd = view.MainView.errorFn;

/** view.MainView.consoleViewUpdateNumComments(num: number)
 * show the number of comments on the photo
 */
view.MainView.prototype.consoleViewUpdateNumComments = view.MainView.errorFn;

