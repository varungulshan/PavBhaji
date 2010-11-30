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
  this.imageArrayViewClear();
  var divelement = document.createElement("div");
  for (var i = 0; i < this._childIconNodes.length; ++i) {
    divelement.appendChild(this.imageArrayViewAddImageHolder(i));
  }
  this._iconTable.appendChild(divelement);
} 

view.MainViewImpl.prototype.imageArrayViewClickHandler = function (idx) {
  this.photoViewClosePhoto();
  goog.asserts.assert(idx < this._childIconNodes.length);
  this._currentPhotoIndex = idx;
  this._loadingDiv.style.visibility = 'visible';
  this._model.gotoIcon(this._childIconNodes[idx]);
}

view.MainViewImpl.prototype.imageArrayViewAddImageHolder = 
  function (idx)  {
  var view = this;
  var divelement =  document.createElement("div");
  divelement.id = "image_holder";
  var imgelement = document.createElement("img");
  imgelement.src = this._childIconNodes[idx].iconImgUrl;
  var pelement = document.createElement("p");
  common.helpers.setText(pelement, this._childIconNodes[idx].iconText);
  var tip = new goog.ui.Tooltip(divelement, 
    this._childIconNodes[idx].toolTipText);
  divelement.appendChild(imgelement);
  divelement.appendChild(pelement);
  divelement.onclick =  function(value) {
        return function() {
          view.imageArrayViewClickHandler(value);
        }
      }(idx);
  return divelement;
}

view.MainViewImpl.prototype.imageArrayViewClear = function () {
  while(this._iconTable.hasChildNodes())
    this._iconTable.removeChild(this._iconTable.firstChild);
}
