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

/**
 * Returns the initials, given the full name of a person
 */
common.helpers.getInitials = function(fullName){
  var firstChar='';
  if(fullName.length>0){
    firstChar=fullName.charAt(0);
  }
  var spaceIdx=fullName.indexOf(' ');
  var secondChar='';
  if(spaceIdx!==-1 && (spaceIdx+1)<fullName.length){
    secondChar=fullName.charAt(spaceIdx+1);
  }
  return firstChar.concat(secondChar);
};

common.helpers.getFirstName = function(fullName){
  var spaceIdx=fullName.indexOf(' ');
  if(spaceIdx===-1){spaceIdx=fullName.length;};
  return fullName.slice(0,spaceIdx);
};

common.helpers.virtualErrorFn = function(){
  throw Error('Calling a virtual function not allowed\n');
};

/**
 * This function is supposed to take a string and return a summary
 * of it so that it can fit in a smaller space.
 * TODO: Check if goog library has a function for this.
 */
common.helpers.shortenText = function(text,maxLen){
  goog.asserts.assert(typeof maxLen === 'number');
  maxLen=Math.min(text.length,maxLen);
  return text.slice(0,maxLen); // this is a very dumb summary right now
};

/**
 * Sets the text of DOM element in browser independent way
 */

common.helpers.setText = function (element,text) {
    if (element.innerText != undefined) {
        element.innerText = text
      } else {
        element.textContent = text;
      }
}
