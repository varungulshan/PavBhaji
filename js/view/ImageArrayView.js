/** 
 * This file implements the ImageArray related function as mentioned in the
 * interface view.MainView
 */

goog.require('common.helpers');
goog.require('view.MainView');
goog.require('view.MainViewImpl');

view.MainViewImpl.prototype.imageArrayViewUpdate = function () {
  // TODO(Rahul): Handle the root node case separately
  // TODO(Rahul): Handle the case when there are more than 25 children
  var imageHolders = common.helpers.getElementByTagAndClassName('div',
                                                                'image_holder');
  var numImageHolders = 25;
  goog.asserts.assert( imageHolders.length == numImageHolders);
  this._childIconNodes = this._model.getCurrentIcons();
  for (var i = 0; i < numImageHolders; ++i) {
    if ( i < this._childIconNodes.length) {
      imageHolders[i].style.visibility = 'visible';
      imageHolders[i].style.backgroundImage = "url(" +
          this._childIconNodes[i].iconImgUrl + ")";
    } else {
      imageHolders[i].style.visibility = 'hidden';
    }
  }
}
