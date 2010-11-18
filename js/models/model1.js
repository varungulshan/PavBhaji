/**
 * This file implements a concrete model class, obeying the inferface
 * of AbstractModel class
 */

goog.provide('models.Model1');

goog.require('common.helpers');
goog.require('common.IconNode');
goog.require('common.PersonIcon');
goog.require('common.AlbumIcon');
goog.require('common.FriendsIcon');
goog.require('common.PhotoIcon');
goog.require('common.PhotosOfPersonIcon');
goog.require('models.AbstractModel');
goog.require('goog.asserts');
goog.require('goog.Timer');

// ---- Begin implementation of Model1 ---------
models.Model1 = function(){
  models.AbstractModel.call(this);
  this.userId='';
  this.currentState=models.Model1.State.folderView;
};
goog.inherits(models.Model1,models.AbstractModel);

models.Model1.prototype.initialize = function(fbObj,userId){
  goog.asserts.assert(typeof userId === 'string');
  this.fb=fbObj;
  this.userId=userId;

  var rootIcon=new common.IconNode('root','',0,-1);
  var rootNode=new models.Model1.TreeNode(rootIcon,false);

  var homeIcon=new common.IconNode('home','',0,0);
  var homeNode=new models.Model1.HomeNode(homeIcon); 

  rootNode.addChildren(homeNode);
  rootNode._isOpen=true; // Need this hacky private member access once!

  this._openNodeList=[rootNode]; //Array of open nodes, each node should be open
  this._openNodeIdx=0; // Index of currently open node
  this.currentState=models.Model1.State.folderView;
  this.gotoIcon(homeIcon);
};

models.Model1.prototype.gotoIcon = function(targetIcon){
  goog.asserts.assert(targetIcon instanceof common.IconNode);
  var parentIconDepth=targetIcon.fileDepth-1;
  var iconChildIdx=targetIcon.fileIdx;

  goog.asserts.assert(parentIconDepth>=0);
  goog.asserts.assert(parentIconDepth<this._openNodeList.length);

  var parentNode=this._openNodeList[parentIconDepth];
  var nodeToOpen=parentNode.getChild(iconChildIdx);

  this._openNode(nodeToOpen);
  if(nodeToOpen.isLeaf){
    this.currentState=models.Model1.State.photoView;
  }else{
    this.currentState=models.Model1.State.folderView;
  }
};

models.Model1.prototype._openNode = function(nodeToOpen){
  var nodeDepth=nodeToOpen.iconNode.fileDepth;

  var curModel=this;

  if(nodeDepth<this._openNodeList.length){
    if(nodeToOpen==this._openNodeList[nodeDepth]){
      // Node is already open, use cached results
      goog.asserts.assert(nodeToOpen.isOpen(),'Expected node to be open\n');
      nodeToOpen.exploreNode(this);
    }
    else{
      // Node's parent is already open, and another child of that parent
      // is open. 
      goog.asserts.assert(!nodeToOpen.isOpen(),'Expected node to be closed\n');
      goog.asserts.assert(nodeDepth>=1,'Expected node depth >=1');
      this._openNodeList[nodeDepth].closeNode();
      this._openNodeList=this._openNodeList.slice(0,nodeDepth);
      this._openNodeList.push(nodeToOpen);
      nodeToOpen.exploreNode(this);
    }
  }
  else{
    // Node is the bottomost (uptil now) node in the tree
    goog.asserts.assert(!nodeToOpen.isOpen());
    goog.asserts.assert(nodeDepth===this._openNodeList.length);
    this._openNodeList.push(nodeToOpen);
    nodeToOpen.exploreNode(this);
  }

  this._openNodeIdx=nodeDepth;
  goog.asserts.assert(nodeDepth<this._openNodeList.length,
      'Inconsistent open node idx');
};

models.Model1.prototype.raiseOpenFolderEvent = function(){
  // This function raises the open folder event asynchronously
  // making use of the library function in goog
  var _model=this;
  goog.asserts.assert(this._openNodeList[this._openNodeIdx].isOpen(),
      'Expected node to be opened on the openFolder notification');
  var raiseEventFn = function(){
    _model._openFolderEvent.notify();
  };
  goog.Timer.callOnce(raiseEventFn,0);
};

models.Model1.prototype.attachToOpenFolderEvent = function(eventHandler){
  goog.asserts.assert(typeof eventHandler === 'function',
      'Event handler expected to be a function');
  this._openFolderEvent.attach(eventHandler);
};

models.Model1.prototype.attachToOpenPhotoEvent = function(eventHandler){
  goog.asserts.assert(typeof eventHandler === 'function',
      'Event handler expected to be a function');
  this._openPhotoEvent.attach(eventHandler);
};

models.Model1.prototype.getCurrentIcons = function(){
  if(this.currentState!==models.Model1.State.folderView){
    throw Error(
        'Expected model to be in folder view state on model.getCurrenIcons()'
        );
  }
  var curNode=this._openNodeList[this._openNodeIdx];
  var curChildren = curNode.getChildren();

  var iconArray = new Array();
  for(var i=0;i < curChildren.length; i++){
    iconArray.push(curChildren[i].iconNode);
  }
  return iconArray;
  // Note we are not creating copy of icons, passing the icons
  // that the model uses to the view, assumption is that view will not alter
  // them
};

//  --- Static values of Model1 ------------

// implementing a Enum type
models.Model1.State = {'folderView': 0, 'photoView': 1};

models.Model1.resourceDir = '../resources/'; // This path needs to be
    // relative to the document which is loaded, need to be more
    // smarter on how to set it

// ----- End implementation of Model1 ------------

// ---- Begin implementation of supporting objects ---

// Enum type object for indexing various nodes
//models.Model1.NodeType = {'root':0,'person':1,'album':2,'friends':3,
//                          'photo':4,'photosOfPerson':5,'home':6};

//models.Model1.invalidOpenFn = function(){
  //throw Error('Invalid open node function called, should not happen\n');
//}

models.Model1.TreeNode = function(iconNode,isLeaf){
  goog.asserts.assert(iconNode instanceof common.IconNode);
  this.isLeaf=isLeaf;
  this.iconNode=iconNode;
  this._isOpen=false;
  this._children=[]; // Array of TreeNodes
};

/**
 * exploreNode(model), function to open a node
 */
models.Model1.TreeNode.prototype.exploreNode = common.helpers.virtualErrorFn;

/**
 * closeNode(), function to close a node
 */
models.Model1.TreeNode.prototype.closeNode = function(){
  this._children=[];
  this._isOpen=false;
};

/**
 * Function to add more children, can either pass a single child
 * or an array of children
 */
models.Model1.TreeNode.prototype.addChildren = function(newChildren){
  if(common.helpers.isArray(newChildren)){
    var numCurrentChildren=this._children.length;
    var currentDepth=this.iconNode.fileDepth;
    for(var i=0;i<newChildren.length;i++){
      newChildren[i].iconNode.fileDepth=currentDepth+1;
      newChildren[i].iconNode.fileIdx=i+numCurrentChildren;
    }
    this._children=this._children.concat(newChildren);
  }else{
    goog.asserts.assert(newChildren instanceof models.Model1.TreeNode);
    newChildren.iconNode.fileDepth=this.iconNode.fileDepth+1;
    newChildren.iconNode.fileIdx=this._children.length;
    this._children.push(newChildren);
  }
};

models.Model1.TreeNode.prototype.getChildren = function(){
  return this._children;
};

models.Model1.TreeNode.prototype.getChild= function(childIdx){
  goog.asserts.assert(childIdx>=0 && childIdx<this._children.length);
  return this._children[childIdx];
};

models.Model1.TreeNode.prototype.isOpen = function(){
  return this._isOpen;
};

// ---- Begin implementation of HomeNode ---
models.Model1.HomeNode = function(iconNode){
  goog.asserts.assert(iconNode instanceof common.IconNode);
  models.Model1.TreeNode.call(this,iconNode,false);
};
goog.inherits(models.Model1.HomeNode,models.Model1.TreeNode);

models.Model1.HomeNode.prototype.exploreNode = function(model){
  if(this.isOpen()){
    model.raiseOpenFolderEvent();
    return;
  }

  var userPic = 'https://graph.facebook.com/'+model.userId+'/picture';
  var userIcon = new common.PersonIcon('Your photos',userPic,0,
                                       0,model.userId);
  var userNode = new models.Model1.PersonNode(userIcon);

  var friendsPic = models.Model1.resourceDir+'buddies.jpg';
  var friendsIcon = new common.FriendsIcon('Friends photos',friendsPic,
                                           0,0);
  var friendsNode = new models.Model1.FriendsNode(friendsIcon);

  this.addChildren([userNode,friendsNode]);
  this._isOpen=true;
  model.raiseOpenFolderEvent();

};

// ---- End implementation of HomeNode ------

// --- Begin implementation of FriendsNode -------
models.Model1.FriendsNode = function(iconNode){
  goog.asserts.assert(iconNode instanceof common.FriendsIcon);
  models.Model1.TreeNode.call(this,iconNode,false);
};
goog.inherits(models.Model1.FriendsNode,models.Model1.TreeNode);

models.Model1.FriendsNode.prototype.exploreNode = function(model){
  if(this.isOpen()){
    models.raiseOpenFolderEvent();
    return;
  }
  // Else need to make a FB api call
  var fbObj=model.fb;
  // TODO
  common.helpers.virtualErrorFn();
};

// --- End implementation of FriendsNode ---------

// --- Begin implementation of PersonNode -------
models.Model1.PersonNode = function(iconNode){
  goog.asserts.assert(iconNode instanceof common.PersonIcon);
  models.Model1.TreeNode.call(this,iconNode,false);
};
goog.inherits(models.Model1.PersonNode,models.Model1.TreeNode);
// --- End implementation of PersonNode ---------

// ---- End implementation of supporting objects -----
