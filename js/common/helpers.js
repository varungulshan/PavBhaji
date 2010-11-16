/**
 * This file implements misc useful functions.
 */
goog.provide('common.helpers');

common.helpers.isArray = function(x){
  if(typeof x === 'object'){
    if(x instanceof Array){return true;}
    else{return false;}
  }else{return false;}
};

common.helpers.getElementByTagAndClassName = function(tagName, className) {
  var elements = document.getElementsByTagName(tagName);
  var myclass = new RegExp('\\b'+className+'\\b');
  var retnode = [];
  for (var i = 0; i < elements.length; ++i) {
    var classes = elements[i].className;
    if (myclass.test(classes))
      retnode.push(elements[i]);
  }
  return retnode;
}
