/**
 * This file implements an interface to the view class, so that the skeleton
 * of the class can be seen quickly, without knowing the implementation details
 *
 * It is useful to think of the this class in a heirarchical structure with
 * MainView at the top and NavbarView, ContextbarView, ImageArrayView, PhotoView
 * etc. at the next level. We should ideally have separate classes for these but
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
  this._maxImageWidth = 700;
  this._maxImageHeight = 540;
  this._currentPhotoIndex = -1; // keeps track of the current photo being shown
  this._clearImage = "../resources/Clear.gif";
  this._hashMap = [];
  // attach listeners
  var _view = this;
  var openFolderEventHandlerClosure = function () {
    _view.openFolderEventHandler();
  }
  var openPhotoEventHandlerClosure = function () {
    _view.openPhotoEventHandler();
  }
  var addCommentEventHandlerClosure = function () {
    _view.addCommentEventHandler();
  }
  this._model.attachToOpenFolderEvent(openFolderEventHandlerClosure);
  this._model.attachToOpenPhotoEvent(openPhotoEventHandlerClosure);
  this._model.attachToAddCommentEvent(addCommentEventHandlerClosure);
  //attach click handlers
  var closePhotoButtonClickHandlerClosure = function () {
    _view.photoViewClosePhotoButtonClickHandler(); 
  }
  var nextButtonClickHandlerClosure = function () {
    _view.photoViewNextPhotoButtonClickHandler(); 
  }
  var prevButtonClickHandlerClosure = function () {
    _view.photoViewPrevPhotoButtonClickHandler(); 
  }
  document.getElementById('fullres_photo_close_button').onclick =
    closePhotoButtonClickHandlerClosure;
  document.getElementById('fullres_photo_next_button').onclick =
    nextButtonClickHandlerClosure;
  document.getElementById('fullres_photo_prev_button').onclick =
    prevButtonClickHandlerClosure;
  //add console zippy
  this._consoleZippy = new goog.ui.AnimatedZippy('console_header_div',
                                                 'console_content_div');
  this._consoleContent = document.getElementById("console_content_div");
  this._consoleHeader = document.getElementById("console_header_div");
  this._commenterColors = new Array("brown","darkblue","darkred",
                               "teal","olive");
  // set up key handling
  this._keyHandler = new goog.events.KeyHandler(document);
  var handleKeyPressClosure = function(e) {
    _view.handleKeyPress(e);
  }
  goog.events.listen(this._keyHandler,'key', handleKeyPressClosure);
  // cache some divs images in DOM for faster access
  this._photoDiv = document.getElementById('fullres_photo_div');
  this._photoImg = document.getElementById('fullres_photo_img');
  this._photoCaption = document.getElementById('caption_div');
  
  this._loadingDiv = document.getElementById('loading_div');

  this._iconTable = document.getElementById('icon_table');
  
  this._navBar = document.getElementById('navigation_bar');
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
 * view.addCommentEventHandler()
 * Invoked when the comment addition is successful
 */
view.MainView.prototype.addCommentEventHandler = view.MainView.errorFn;


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
 * view.MainView.imageArrayViewAddImageHolder(idx)
 * Adds a new thumbnail holder corresponding to idx^th child. Returns
 * that imageholder
 */
view.MainView.prototype.imageArrayViewAddImageHolder = view.MainView.errorFn;

/**
 * view.MainView.imageArrayViewClear()
 * Clears all holders and removes them
 */
view.MainView.prototype.imageArrayViewClear = view.MainView.errorFn;

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

/** view.MainView.consoleViewAddCommentArea()
 * adds a text area and a button for the user to make comment
 */
view.MainView.prototype.consoleViewAddCommentArea = view.MainView.errorFn;

/** view.MainView.consoleViewUpdateNumComments(num: number)
 * show the number of comments on the photo
 */
view.MainView.prototype.consoleViewUpdateNumComments = view.MainView.errorFn;

/**
 * view.MainView.consoleViewAddCommentClickHandler
 * adds the comment if it is not empty
 */
view.MainView.prototype.consoleViewAddCommentClickHandler = 
    view.MainView.errorFn;

/**
 * view.MainView.consoleViewBuildHash(commentArray)
 * learn mapping from commenters to colors
 */
view.MainView.prototype.consoleViewBuildHash = view.MainView.errorFn;

/**
 * view.MainView.consoleViewRenderComment(comment: commentObj)
 * render a comment obj
 */
view.MainView.prototype.consoleViewRenderComment = view.MainView.errorFn;

//--------------------------------------------------------------------------
// Functions for PhotoView
// -------------------------------------------------------------------------

/** view.photoViewDisplayPhoto(photoObj: PhotoObject)
 *
 * Given a photo object, sets it up for viewing
 */
view.MainView.prototype.photoViewDisplayPhoto = view.MainView.errorFn;

/**
 * view.photoViewClosePhotoButtonClickHandler
 * Invoked when a user closes an open photo
 */ 
view.MainView.prototype.photoViewClosePhotoButtonClickHandler =
    view.MainView.errorFn;

/**
 * view.photoViewNextButtonClickHandler
 * goto next image in album, cycle if we have reached the end
 */
view.MainView.prototype.photoViewNextButtonClickHandler = 
  view.MainView.errorFn;

/**
 * view.photoViewPrevButtonClickHandler
 * goto prev image in album, cycle if we have reached the beginning
 */
view.MainView.prototype.photoViewPrevButtonClickHandler = 
  view.MainView.errorFn;

/**
 *  view.photoViewIsOpen()
 *  returns a boolean specifying whether the photoview is open or not
 */
view.MainView.prototype.photoViewIsOpen = view.MainView.errorFn;
