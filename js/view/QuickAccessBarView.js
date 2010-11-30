/** 
 * This file implements the Quick Access Bar related functions as mentioned in
 * the interface view.MainView
 */

goog.provide('view.MainViewImplPart5');

goog.require('view.MainView');
goog.require('view.MainViewImpl');
goog.require('common.helpers');
goog.require('goog.asserts');

view.MainViewImpl.prototype.quickAccessBarViewUpdate = function () {
  var numPages = Math.floor(this._childIconNodes.length/this._numImageHolders);
  if (this._childIconNodes.length % this._numImageHolders == 0)
    --numPages;
  var numButtons = Math.min(this._maxQuickAccessBarIcons,
                            numPages + 1);  
  var skip = Math.floor((numPages+1)/numButtons);
  var view = this;
  // empty out the quick access bar 
  while(this._quickAccessBar.hasChildNodes())
    this._quickAccessBar.removeChild(this._quickAccessBar.firstChild);
  for(var i = 0; i < numButtons; ++i) {
    var index = i*skip;
    var divelement = document.createElement("div");
    divelement.id = "quick_access_bar_button";
    common.helpers.setText(divelement, (index + 1).toString());
    divelement.onclick = function(value) {
      return function() {
        view.quickAccessBarViewClickHandler(value);
      }
    }(index);
    this._quickAccessBar.appendChild(divelement);
  }
}

view.MainViewImpl.prototype.quickAccessBarViewClickHandler = function(page_idx)
{
  // TODO(Rahul): Should we disable this when a photo is open?
  goog.asserts.assert(page_idx  < this._childIconNodes.length);
  this._currentIconNode.curPageNum = page_idx;
  this.imageArrayViewUpdatePage();
}
