/**
 * This file implements the top level functions of the View, obeying the
 * interface of MainView class
 */

goog.provide('view.MainViewImpl');

goog.require('common.helpers');
goog.require('view.MainView');
goog.require('models.AbstractModel');
goog.require('goog.asserts');
goog.require('goog.events.KeyCodes');

view.MainViewImpl = function(model) {
  view.MainView.call(this,model);
}
goog.inherits(view.MainViewImpl,view.MainView);
goog.exportSymbol('view.MainViewImpl',view.MainViewImpl);

view.MainViewImpl.prototype.initialize = function() {
}
//goog.exportProperty(view.MainViewImpl,'initialize',
    //view.MainViewImpl.prototype.initialize);
goog.exportSymbol('view.MainViewImpl.prototype.initialize',
  view.MainViewImpl.prototype.initialize);

view.MainViewImpl.prototype.openFolderEventHandler = function() {
  this._loadingDiv.style.visibility = 'hidden';
  this._currentIconNode = this._model.getOpenIcon();
  this.updateView();
}

view.MainViewImpl.prototype.openPhotoEventHandler = function() {
  this._loadingDiv.style.visibility = 'hidden';
  var photoObj = this._model.getCurrentPhoto();
  this.photoViewDisplayPhoto(photoObj);
}

view.MainViewImpl.prototype.addCommentEventHandler = function() {
  var comment_area = document.getElementById('comment_area');  
  var comment = comment_area.value;
  comment_area.value = '';
  var commentObj = this._model.getLastPostedComment();
  comment_area.readOnly = false;
  this.consoleViewRenderComment(commentObj);
  this.consoleViewUpdateNumComments(this._consoleContent.children.length - 1);
}

view.MainViewImpl.prototype.updateView = function() {
  this.consoleViewClose();
  this.consoleViewClear();
  // update navigation bar
  this.navbarViewUpdate();
  // update contextbar
  this.contextbarViewUpdate();
  // update image array
  this.imageArrayViewUpdate();
}

view.MainViewImpl.prototype.handleKeyPress = function (e) {
  switch(e.keyCode) {
    case goog.events.KeyCodes.CTRL:
      this._consoleZippy.toggle();
      break;
    case goog.events.KeyCodes.RIGHT:
      if (this.photoViewIsOpen())
        this.photoViewNextButtonClickHandler();
      break;
    case goog.events.KeyCodes.LEFT:
      if (this.photoViewIsOpen())
        this.photoViewPrevButtonClickHandler();
      break;
    case goog.events.KeyCodes.ESC:
      if (this._consoleZippy.isExpanded())
        this.consoleViewClose();
      else if (this.photoViewIsOpen())
        this.photoViewClosePhotoButtonClickHandler();
      break;
  }
}


view.MainViewImpl.prototype.getLikeDiv = function(likeObjArray) {
  var divelement = document.createElement("div");
  if (likeObjArray.length == 0)
    return divelement;
  var id_str = 'div_' + common.helpers.randomString();
  divelement.id = id_str;
  var tooltip = new goog.ui.Tooltip(divelement);
  tooltip.className = 'like_tooltip';
  var HTMLstr = "";
  for ( var i = 0;i < likeObjArray.length; ++i)
    HTMLstr += (likeObjArray[i].name + "<br>");
  tooltip.setHtml(HTMLstr);
  common.helpers.setText(divelement,likeObjArray.length.toString() + ' likes');
  return divelement; 
}
