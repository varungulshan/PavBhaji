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
      if (this.photoViewIsOpen() && this.commentAreaIsEmpty())
        this.photoViewNextButtonClickHandler();
      break;
    case goog.events.KeyCodes.LEFT:
      if (this.photoViewIsOpen() && this.commentAreaIsEmpty())
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


view.MainViewImpl.prototype.getLikeDiv = function(userId, 
                                                  likeObjArray ,numVisible) {
  var divelement = document.createElement("div");
  var divstr="";
  // comment out the following code to add a like button
  // check if the user has already liked this
  //var already_liked = false;
  //for(var i=0;i<likeObjArray.length;++i) {
  //  if (likeObjArray[i].id == userId) {
  //    already_liked = true;
  //    break;
  //  }
  //}
  //if (!already_liked) {
  // divstr+= '<div>Like<img src="' +
  //          this._likeIconImg + '"></div>' 
  //}
  if (likeObjArray.length == 0) {
    divelement.innerHTML = divstr;
    return divelement;
  }
  var id_str = 'div_' + common.helpers.randomString();
  divelement.id = id_str;
  var HTMLstr = "";
  numVisible = Math.min(numVisible, likeObjArray.length);
  for (var i =0; i < numVisible; ++i) {
    var nameStr = '<a href="'+likeObjArray[i].profileUrl+'" target="_blank">' + 
                  '<span style="color:white">' +
                  likeObjArray[i].name + '</span></a>';
    if (i == 0)
      divstr += nameStr;
    else if (i+1 == numVisible && numVisible == likeObjArray.length)
      divstr += (' and '+ nameStr); 
    else 
      divstr += (', '+nameStr); 
  }
  if (numVisible == likeObjArray.length) {
    if (numVisible == 1)
      divstr += ' likes this';
    else
      divstr += ' like this';
    divelement.innerHTML = divstr;
  } else {
    var tooltip = new goog.ui.Tooltip(divelement);
    tooltip.className = this._likeTooltipClass;
    for ( var i = numVisible;i < likeObjArray.length; ++i)
      HTMLstr += (likeObjArray[i].name + "<br>");
    tooltip.setHtml(HTMLstr);
    divstr += (' and ' + 
               (likeObjArray.length - numVisible).toString() + 
               ' others like this');
    divelement.innerHTML = divstr;
  }
  return divelement;
}
