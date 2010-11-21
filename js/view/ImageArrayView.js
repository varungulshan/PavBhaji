/** 
 * This file implements the ImageArray related function as mentioned in the
 * interface view.MainView
 */

goog.require('common.helpers');
goog.require('view.MainView');

goog.provide('view.MainViewImpl1');

view.MainViewImpl.prototype.imageArrayViewUpdate = function () {
  this._childIconNodes = this._model.getCurrentIcons();
  this._currentPage = 0;
  this.imageArrayViewUpdatePage();
}

view.MainViewImpl.prototype.imageArrayViewUpdatePage = function () {
  var imageHolders = common.helpers.getElementByTagAndClassName('div',
                                                                'image_holder');
  var numImageHolders = 25;
  var view = this;
  var idx = this._currentPage * numImageHolders;
  goog.asserts.assert( imageHolders.length == numImageHolders);
  for (var i = 0; i < numImageHolders; ++i, ++idx) {
    if ( idx < this._childIconNodes.length) {
      imageHolders[i].style.visibility = 'visible';
      imageHolders[i].children[0].src = this._childIconNodes[idx].iconImgUrl;
      var iNew = new Number(idx);
      imageHolders[i].onclick = new Function(
          'view.imageArrayViewClickHandler('+idx+')');
      common.helpers.setText(imageHolders[i].children[1],
          this._childIconNodes[idx].iconText);
    } else {
      imageHolders[i].style.visibility = 'hidden';
    }
  }
  if (this._currentPage > 0)
    document.getElementById('prev_button').style.visibility = 'visible';
  else
    document.getElementById('prev_button').style.visibility = 'hidden';
  if (this._childIconNodes.length >= idx)
    document.getElementById('next_button').style.visibility = 'visible';
  else
    document.getElementById('next_button').style.visibility = 'hidden';
} 

view.MainViewImpl.prototype.imageArrayViewClickHandler = function (idx) {
  goog.asserts.assert(idx < this._childIconNodes.length);
  this._model.gotoIcon(this._childIconNodes[idx]);
}

view.MainViewImpl.prototype.imageArrayViewNextClickHandler = function () {
  this._currentPage++;
  this.imageArrayViewUpdatePage();
}

view.MainViewImpl.prototype.imageArrayViewPrevClickHandler = function () {
  this._currentPage--;
  goog.asserts.assert(this._currentPage >= 0);
  this.imageArrayViewUpdatePage();
}
