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
  //this._childIconNodes = model.getcurrentIcons();
  this._childIconNodes[0] = new common.IconNode('Me',
                                                '../resources/loading.gif',
                                                 0,0);
  this._childIconNodes[1] = new common.IconNode('Friends',
                                                '../resources/buddies.jpg',
                                                0,0);
  for (var i = 0; i < numImageHolders; ++i) {
    if ( i < this._childIconNodes.length) {
      imageHolders[i].style.display = 'box';
      imageHolders[i].style.backgroundImage = "url(" +
          this._childIconNodes[i].iconImgUrl + ")";
    } else {
      imageHolders[i].style.display = 'none';
    }
  }
}
