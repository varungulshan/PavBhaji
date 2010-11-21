/**
 * This file implements the top level functions of the View, obeying the
 * interface of MainView class
 */

goog.provide('view.MainViewImpl');

goog.require('common.helpers');
goog.require('view.MainView');
goog.require('models.AbstractModel');
goog.require('goog.asserts');

view.MainViewImpl = function(model) {
  view.MainView.call(this,model);
}
goog.inherits(view.MainViewImpl,view.MainView);
goog.exportSymbol('view.MainViewImpl',view.MainViewImpl);

view.MainViewImpl.prototype.initialize = function() {
  this._currentIconNode = this._model.getOpenIcon();
  this.updateView(); 
}
//goog.exportProperty(view.MainViewImpl,'initialize',
    //view.MainViewImpl.prototype.initialize);
goog.exportSymbol('view.MainViewImpl.prototype.initialize',
  view.MainViewImpl.prototype.initialize);

view.MainViewImpl.prototype.openFolderEventHandler = function() {
  this._currentIconNode = this._model.getOpenIcon();
  this.updateView();
}

view.MainViewImpl.prototype.openPhotoEventHandler = function() {
  var photoDiv = document.getElementById('fullres_photo_div');
  var photoImg = document.getElementById('fullres_photo_img');
  photoDiv.style.visibility = 'visible';
  var photoObj = this._model.getCurrentPhoto();
  photoImg.src = photoObj.imgUrl;
}

view.MainViewImpl.prototype.closePhotoButtonClickHandler = function () {
  this.closePhoto();
  var parentNodes = this._model.getParentIcons();
  this._model.gotoIcon(parentNodes[parentNodes.length-2]);  
}

/** closes the photo if it's open 
 */
view.MainViewImpl.prototype.closePhoto = function () {
  var photoDiv = document.getElementById('fullres_photo_div');
  var photoImg = document.getElementById('fullres_photo_img');
  photoDiv.style.visibility = 'hidden';
  photoImg.src = '';
}

view.MainViewImpl.prototype.updateView = function() {
  // update navigation bar
  this.navbarViewUpdate();
  // update contextbar
  // this.contextbarViewUpdate();
  // update image array
  this.imageArrayViewUpdate();
}

// Navbar

view.MainViewImpl.prototype.navbarViewUpdate = function() {
  // make all buttons on the navbar till the current depth visible
  // all buttons after that are invisible
  var i = 0;
  var numButtons = 4; 
  var buttons = common.helpers.getElementByTagAndClassName('div',
                                                           'navigation_button');
  goog.asserts.assert(buttons.length == numButtons);  
  for(i = 0; i < numButtons; ++i) {
    if (i+1 < this._currentIconNode.fileDepth) {
      // visible but unselected
      buttons[i].style.visibility = 'visible';
      buttons[i].id = "";
      buttons[i].onclick = new Function(
        'view.navbarViewClickHandler('+i+')');
    } else if ( i+1 == this._currentIconNode.fileDepth) {
      // visible and selected
      buttons[i].style.visibility = 'visible';
      buttons[i].id = "selected_navigation_button";
      common.helpers.setText(buttons[i],this._currentIconNode.navText);
    } else {
      // make invisible
      buttons[i].style.visibility = 'hidden';
    }
  }
}


view.MainViewImpl.prototype.navbarViewClickHandler = function(idx) {
  this.closePhoto();
  var parentNodes = this._model.getParentIcons();
  goog.asserts.assert(idx  < parentNodes.length);
  this._model.gotoIcon(parentNodes[idx]);
}

// ImageArrayView
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
