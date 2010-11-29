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
  if (photoObj.caption == '')
    photoCaption.style.visibility = 'hidden';
  else {
    photoCaption.style.visibility = 'visible';
    common.helpers.setText(photoCaption, photoObj.caption);
  }
  // set photo comments
  this.consoleViewUpdateNumComments(photoObj.commentArray.length);
  // first create a map from commenter names to ids;
  var id = 2;
  var maxId = this._commenterColors.length;
  var hashMap = [];
  for (var i = 0; i < photoObj.commentArray.length; ++i) {
    if (hashMap[photoObj.commentArray[i].from.name] == undefined) {
      hashMap[photoObj.commentArray[i].from.name] = id;
      id = (id + 1)%maxId;
    }
  }
  for (var i = 0; i < photoObj.commentArray.length; ++i) {
    var HTMLstring = 
      '<span class="commenter_name" style="color:'+ 
      this._commenterColors[hashMap[photoObj.commentArray[i].from.name]]+'">' 
      + photoObj.commentArray[i].from.name + 
      '</span>: ' + photoObj.commentArray[i].message;
    this.consoleViewAdd(HTMLstring);
  }
  this.consoleViewAddCommentArea();

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
  this._photoDiv.style.visibility = 'hidden';
  this._photoCaption.style.visibility = 'hidden';
  this._photoImg.src = this._clearImage;
  this.consoleViewClose();
  this.consoleViewClear();
  this.consoleViewUpdateNumComments(0);
}

