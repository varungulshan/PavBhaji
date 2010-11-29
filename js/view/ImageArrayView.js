/** 
 * This file implements the ImageArray related function as mentioned in the
 * interface view.MainView
 */

goog.provide('view.MainViewImplPart1');

goog.require('view.MainViewImpl');
goog.require('common.helpers');
goog.require('view.MainView');


view.MainViewImpl.prototype.imageArrayViewUpdate = function () {
  this._childIconNodes = this._model.getCurrentIcons();
  this.imageArrayViewUpdatePage();
}

view.MainViewImpl.prototype.imageArrayViewUpdatePage = function () {
  var imageHolders = common.helpers.getElementByTagAndClassName('div',
                                                                'image_holder');
  var numImageHolders = this._numImageHolders;
  var view = this;
  var idx = this._currentIconNode.curPageNum * numImageHolders;
  goog.asserts.assert( imageHolders.length == numImageHolders);
  for (var i = 0; i < numImageHolders; ++i, ++idx) {
    if ( idx < this._childIconNodes.length) {
      imageHolders[i].style.visibility = 'visible';
      imageHolders[i].children[0].src = this._childIconNodes[idx].iconImgUrl;
      var iNew = new Number(idx);
      imageHolders[i].onclick = function(value) {
        return function() {
          view.imageArrayViewClickHandler(value);
        }
      }(idx);
      common.helpers.setText(imageHolders[i].children[1],
          this._childIconNodes[idx].iconText);
      this._imageArrayToolTips[i].setText(
          this._childIconNodes[idx].toolTipText);
    } else {
      imageHolders[i].style.visibility = 'hidden';
    }
  }
  if (this._currentIconNode.curPageNum > 0)
    document.getElementById('prev_button').style.visibility = 'visible';
  else
    document.getElementById('prev_button').style.visibility = 'hidden';
  if (this._childIconNodes.length >= idx)
    document.getElementById('next_button').style.visibility = 'visible';
  else
    document.getElementById('next_button').style.visibility = 'hidden';
} 

view.MainViewImpl.prototype.imageArrayViewClickHandler = function (idx) {
  this.photoViewClosePhoto();
  goog.asserts.assert(idx < this._childIconNodes.length);
  this._currentPhotoIndex = idx;
  this._loadingDiv.style.visibility = 'visible';
  this._model.gotoIcon(this._childIconNodes[idx]);
}

view.MainViewImpl.prototype.imageArrayViewNextClickHandler = function () {
  this._currentIconNode.curPageNum++;
  this.imageArrayViewUpdatePage();
}

view.MainViewImpl.prototype.imageArrayViewPrevClickHandler = function () {
  this._currentIconNode.curPageNum--;
  goog.asserts.assert(this._currentIconNode.curPageNum >= 0);
  this.imageArrayViewUpdatePage();
}
