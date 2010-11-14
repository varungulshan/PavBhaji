/**
 * This file implements a concrete model class, obeying the inferface
 * of AbstractModel class
 */

goog.provide('models.Model1');

goog.require('helpers');
goog.require('models.AbstractModel');
goog.require('goog.asserts');

// ---- Begin implementation of Model1 ---------
var models.Model1 = function(){
  models.AbstractModel.call(this);
  this._uuid='';
};
goog.inherits(models.Model1,models.AbstractModel);

models.Model1.prototype.initialize = function(fbObj,userId){
  goog.asserts.assert(typeof userId === 'string');
  this._fb=fbObj;
  this._uuid=userId;
  var rootIcon=new common.IconNode('root','',0,0);
  var rootNode=new models.Model1.TreeNode(rootIcon,false);

};

// ----- End implementation of Model1 ------------

// ---- Begin implementation of supporting objects ---
var models.Model1.TreeNode = function(iconNode,depth,isLeaf){
  goog.asserts.assert(iconNode instanceof common.iconNode);
  this.isLeaf=isLeaf;
  this.iconNode=iconNode;
  this._isOpen=false;
  this._children=[]; // Array of TreeNodes
  this._childNumber=0;
  this._depth=0;
};

/**
 * Function to add more children, can either pass a single child
 * or an array of children
 */
models.Model1.TreeNode.prototype.addChildren = function(newChildren){
  if(helpers.isArray(newChildren)){
    this._children.concat(newChildren);
  }else{
    this._children.push(newChildren);
  }
};

models.Model1.TreeNode.prototype.getChildren = function(){
  return this._children;
};

models.Model1.TreeNode.prototype.isOpen = function(){
  return this._isOpen;
};
// ---- End implementation of supporting objects -----
