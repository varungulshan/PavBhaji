/** 
 * This file implements the conSole related function as mentioned in the
 * interface view.MainView
 */

goog.provide('view.MainViewImplPart3');

goog.require('view.MainView');
goog.require('view.MainViewImpl');
goog.require('common.helpers');
goog.require('goog.asserts');

view.MainViewImpl.prototype.consoleViewClose = function () {
  this._consoleZippy.collapse();
}

view.MainViewImpl.prototype.consoleViewClear = function () {
  while(this._consoleContent.children.length > 1)
    this._consoleContent.removeChild(this._consoleContent.firstChild);
}

view.MainViewImpl.prototype.consoleViewAdd = function (str) {
  var divelement = document.createElement("div");
  divelement.id = "comment_div";
  divelement.innerHTML = str;
  this._consoleContent.insertBefore(divelement, this._consoleContent.lastChild);
}

view.MainViewImpl.prototype.consoleViewAddCommentArea = function () {
  var view = this;
  var divelement = document.createElement("div");
  divelement.id = "comment_div";
  var textarea_element = document.createElement("textarea");
  textarea_element.id = "comment_area";
  textarea_element.rows = 2;
  var comment_button = document.createElement("div");
  common.helpers.setText(comment_button,"Comment");
  comment_button.setAttribute("class","fb_button");
  comment_button.onclick = function () {
    view.consoleViewAddCommentClickHandler();
  }
  divelement.appendChild(textarea_element);
  divelement.appendChild(comment_button);
  this._consoleContent.appendChild(divelement);
}

view.MainViewImpl.prototype.consoleViewUpdateNumComments = function (num) {
  var headerString = "Comments("+num.toString()+")";
  common.helpers.setText(this._consoleHeader, headerString);
}

view.MainViewImpl.prototype.consoleViewAddCommentClickHandler = function () {
  if (!this.photoViewIsOpen())
    return;
  // TODO(Rahul): Handle above gracefully, ideally the user should not
  // see the comment area in such a case
  var comment_area = document.getElementById('comment_area');  
  var comment = comment_area.value;
  if (comment.length == 0 || comment_area.readOnly == true)
    return;
  comment_area.readOnly = true;
  this._model.addComment(comment); 
}

view.MainViewImpl.prototype.consoleViewBuildHash = function(commentArray) {
  var id = 2;
  var maxId = this._commenterColors.length;
  this._hashMap = [];
  for (var i = 0; i < commentArray.length; ++i) {
    if (this._hashMap[commentArray[i].from.name] == undefined) {
      this._hashMap[commentArray[i].from.name] = id;
      id = (id + 1)%maxId;
    }
  }
}

view.MainViewImpl.prototype.consoleViewRenderComment = function(comment) {
    //The only case when the color is nor found in the hash map is when
    //this is author's first comment on the photo. In that case, we simply
    //assign the last color, that correspnds to id 1
    if (this._hashMap[comment.from.name] == undefined)
      this._hashMap[comment.from.name] = 1;
    var HTMLstring = 
      '<span class="commenter_name" style="color:'+ 
      this._commenterColors[this._hashMap[comment.from.name]]+
      '">'+ comment.from.name + 
      '</span>: ' + comment.message;
    this.consoleViewAdd(HTMLstring);

}

view.MainViewImpl.prototype.consoleViewInit = function(commentArray) {
  this.consoleViewClear();
  // set photo comments
  this.consoleViewUpdateNumComments(commentArray.length);
  // first create a map from commenter names to ids;
  this.consoleViewBuildHash(commentArray);
  for (var i = 0; i < commentArray.length; ++i) {
    this.consoleViewRenderComment(commentArray[i]);
  }
}
