/**
 * This file implements misc useful functions.
 */
goog.provide('common.helpers');

helpers.isArray = function(x){
  if(typeof x === 'object'){
    if(x instanceof Array){return true;}
    else{return false;}
  }else{return false;}
};
