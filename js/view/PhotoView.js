/** 
 * This file implements the PhotoView related function as mentioned in the
 * interface view.MainView
 */

goog.provide('view.MainViewImplPart4');

goog.require('view.MainViewImpl');
goog.require('common.helpers');
goog.require('view.MainView');

view.MainViewImpl.prototype.photoViewDisplayPhoto = function(photoObj) {
  var photoDiv = this._photoDiv;
  var photoImg = this._photoImg;
  var photoCaption = this._photoCaption;
  photoImg.src = photoObj.imgUrl;
  var x_scaling = this._maxImageWidth/photoObj.width;
  var y_scaling = this._maxImageHeight/photoObj.height;
  var scaling = Math.min(x_scaling,y_scaling);
  scaling = Math.min(1.0,scaling);
  var scaledWidth = Math.floor(scaling * photoObj.width);
  var scaledHeight = Math.floor(scaling * photoObj.height);
  if (scaledWidth == 0)
    scaledWidth = this._maxImageWidth;
  if (scaledHeight == 0)
    scaledHeight = this._maxImageHeight;
  photoDiv.style.width = scaledWidth.toString()+"px";
  photoDiv.style.height = scaledHeight.toString()+"px";
  photoDiv.style.visibility = 'visible';
  common.helpers.clearChildren(photoCaption);
  this.photoViewRemoveTagRects();
  var taggedDivArray = this.photoViewGetTaggedHTML(photoObj.tags, scaledWidth,
                                                                  scaledHeight);
  var captionContainer = document.createElement("div");
  captionContainer.id = "caption_wrapper";
  common.helpers.setText(captionContainer, photoObj.caption);
  if (taggedDivArray.length == 0 && photoObj.caption == '') {
    photoCaption.style.visibility = 'hidden';
  } else {
    photoCaption.style.visibility = 'visible';
    // TODO(Rahul): adding one by one is inefficient
    for(var i = 0; i < taggedDivArray.length ; ++i)
      photoCaption.appendChild(taggedDivArray[i]);
    photoCaption.appendChild(captionContainer);
  } 
  // set photo comments
  this.consoleViewUpdateNumComments(photoObj.commentArray.length);
  // first create a map from commenter names to ids;
  this.consoleViewBuildHash(photoObj.commentArray);
  for (var i = 0; i < photoObj.commentArray.length; ++i) {
    this.consoleViewRenderComment(photoObj.commentArray[i]);
  }
}

view.MainViewImpl.prototype.photoViewRemoveTagRects = function () {
  for (var i = 0; i < this._photoDiv.childNodes.length; ++i) {
    if (this._photoDiv.childNodes[i].className == "tag_rect") {
      this._photoDiv.removeChild(this._photoDiv.childNodes[i]);
      --i;
    }
  }
}

view.MainViewImpl.prototype.photoViewGetTaggedHTML = function(tags, width, 
                                                                    height) {
  var divArray = [];
  if (tags.length == 0)
    return divArray;
  var header_div = document.createElement("div");
  header_div.innerHTML = '<span style="color:lime">In this photo:</span>';
  header_div.setAttribute("class","tag_text");
  divArray.push(header_div);
  for (var i = 0; i < tags.length; ++i) {
    var divelement = document.createElement("div");
    // create a unique id
    divelement.setAttribute("class","tag_rect");
    var id_str = "tag_rectangle_" + common.helpers.randomString();
    divelement.id = id_str;
    divelement.style.top = 
      (Math.floor(0.01*height*tags[i].ycoord) - 20).toString() + "px"; 
    divelement.style.left = 
      (Math.floor(0.01*width*tags[i].xcoord) - 20).toString() + "px"; 
    this._photoDiv.appendChild(divelement);
    var textdivelement = document.createElement("div");
    textdivelement.setAttribute("class","tag_text");
    textdivelement.onmouseover = new Function(
      'document.getElementById("'+id_str+'").style.visibility = "visible"');
    textdivelement.onmouseout = new Function(
      'document.getElementById("'+id_str+'").style.visibility = "hidden"');
    textdivelement.innerHTML = tags[i].name + ", ";
    divArray.push(textdivelement);
  } 
  return divArray;
}

view.MainViewImpl.prototype.photoViewClosePhotoButtonClickHandler = 
function () {
  this._model.closeCurrentPhoto();
  this.photoViewClosePhoto();
  var parentNodes = this._model.getCurrentPathIcons();
}

view.MainViewImpl.prototype.photoViewNextButtonClickHandler = function () {
  this._photoImg.src = this._clearImage;
  this.consoleViewClear();
  goog.asserts.assert(this._currentPhotoIndex>=0);
  ++this._currentPhotoIndex;
  if (this._currentPhotoIndex >= this._childIconNodes.length)
    this._currentPhotoIndex = 0;
  this._model.gotoIcon(this._childIconNodes[this._currentPhotoIndex]);
}

view.MainViewImpl.prototype.photoViewPrevButtonClickHandler = function () {
  
  this._photoImg.src = this._clearImage;
  this.consoleViewClear();
  goog.asserts.assert(this._currentPhotoIndex>=0);
  --this._currentPhotoIndex;
  if (this._currentPhotoIndex < 0)
    this._currentPhotoIndex = this._childIconNodes.length - 1;
  this._model.gotoIcon(this._childIconNodes[this._currentPhotoIndex]);
}

view.MainViewImpl.prototype.photoViewIsOpen = function () {
  if (this._photoDiv.style.visibility == 'hidden')
    return false;
  else
    return true; 
}

/** closes the photo if it's open 
 */
view.MainViewImpl.prototype.photoViewClosePhoto = function () {
  this.photoViewRemoveTagRects();
  this._photoDiv.style.visibility = 'hidden';
  this._photoCaption.style.visibility = 'hidden';
  this._photoImg.src = this._clearImage;
  this.consoleViewClose();
  this.consoleViewClear();
  this.consoleViewUpdateNumComments(0);
}

