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

// ---- Begin implementation of Model1 ---------
models.Model1 = function(){
  models.AbstractModel.call(this);
  this.userId='';
  this.currentState=models.Model1.State.folderView;
  this._openNodeList=[];
  this._openNodeIdx=-1;
  this.currentState=models.Model1.State.folderView;
  this.userNode=null;
  this.friendsNode=null;
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
      goog.asserts.assert(nodeDepth>=1,'Expected node depth >=1');
      this._openNodeList[nodeDepth].closeNode();
      this._openNodeList=this._openNodeList.slice(0,nodeDepth);
      this._openNodeList.push(nodeToOpen);
      nodeToOpen.exploreNode(this);
    }
  }
  else{
    // Node is the bottomost (uptil now) node in the tree
    goog.asserts.assert(nodeDepth===this._openNodeList.length);
    this._openNodeList.push(nodeToOpen);
    nodeToOpen.exploreNode(this);
  }

  this._openNodeIdx=nodeDepth;
  goog.asserts.assert(nodeDepth<this._openNodeList.length,
      'Inconsistent open node idx');
};

models.Model1.prototype.raiseOpenFolderEvent = function(){
  goog.asserts.assert(this._openNodeList[this._openNodeIdx].isOpen(),
      'Expected node to be opened on the openFolder notification');
  this._openFolderEvent.notify();
};

models.Model1.prototype.attachToOpenFolderEvent = function(eventHandler,obj){
  goog.asserts.assert(typeof eventHandler === 'function',
      'Event handler expected to be a function');
  this._openFolderEvent.attach(eventHandler,obj);
};

models.Model1.prototype.attachToOpenPhotoEvent = function(eventHandler,obj){
  goog.asserts.assert(typeof eventHandler === 'function',
      'Event handler expected to be a function');
  this._openPhotoEvent.attach(eventHandler,obj);
};

models.Model1.prototype.getCurrentIcons = function(){
  if(this.currentState!==models.Model1.State.folderView){
    throw Error(
        'Expected model to be in folder view state on model.getCurrentIcons()'
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

//  --- Static values/methods of Model1 ------------

// implementing a Enum type
models.Model1.State = {'folderView': 0, 'photoView': 1};

models.Model1.resourceDir = '../resources/'; // This path needs to be
    // relative to the document which is loaded, need to be more
    // smarter on how to set it

models.Model1.getProfilePicUrl = function(userId,fbSession){
  var userPic = 'https://graph.facebook.com/'+userId+'/picture'+
                '?access_token='+fbSession['access_token'];
  return userPic;
};

models.Model1.getAlbumPicUrl = function(albumId,fbSession){
  // the fbSession is needed because need to pass access token
  var albumPic = 'https://graph.facebook.com/'+albumId+'/picture'+
                '?access_token='+fbSession['access_token'];
  return albumPic;
};

// ----- End implementation of Model1 ------------

// ---- Begin implementation of supporting objects ---

models.Model1.TreeNode = function(iconNode,isLeaf){
  goog.asserts.assert(iconNode instanceof common.IconNode);
  this.isLeaf=isLeaf;
  this.iconNode=iconNode;
  this._isOpen=false;
  this._children=[]; // Array of TreeNodes
  this._alwaysCache=false; 
};

/**
 * exploreNode(model), function to open a node
 */
models.Model1.TreeNode.prototype.exploreNode = common.helpers.virtualErrorFn;

/**
 * closeNode(), function to close a node
 */
models.Model1.TreeNode.prototype.closeNode = function(){
  // Dont close nodes for which alwaysCache flag is set
  if(!this._alwaysCache){
    this._children=[];
    this._isOpen=false;
  }
};

/**
 * Function to set the alwaysCache flag, use this for nodes you
 * think are always accessed fequently, hence should be always on
 * Note that all the parents of this node might also need to have this flag
 * set for it to be useful (depends on node access pattern)
 */

models.Model1.TreeNode.prototype.setAlwaysCache = function(){
  this._alwaysCache=true;
};

models.Model1.TreeNode.prototype.clearAlwaysCache = function(){
  this._alwaysCache=false;
}

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
  this._alwaysCache=true; // always cached
};
goog.inherits(models.Model1.HomeNode,models.Model1.TreeNode);

models.Model1.HomeNode.prototype.exploreNode = function(model){
  if(this.isOpen()){
    model.raiseOpenFolderEvent();
    return;
  }

  var fbSession=model.fb.getSession();
  var userPic = models.Model1.getProfilePicUrl(model.userId,fbSession);
  var userIcon = new common.PersonIcon('Your photos',userPic,0,
                                       0,model.userId,'You');
  var userNode = new models.Model1.PersonNode(userIcon);
  userNode.setAlwaysCache();
  model.userNode=userNode;

  var friendsPic = models.Model1.resourceDir+'buddies.jpg';
  var friendsIcon = new common.FriendsIcon('Friends photos',friendsPic,
                                           0,0);
  var friendsNode = new models.Model1.FriendsNode(friendsIcon);
  model.friendsNode=friendsNode;

  this.addChildren([userNode,friendsNode]);
  this._isOpen=true;
  model.raiseOpenFolderEvent();

};

// ---- End implementation of HomeNode ------

// --- Begin implementation of FriendsNode -------
models.Model1.FriendsNode = function(iconNode){
  goog.asserts.assert(iconNode instanceof common.FriendsIcon);
  models.Model1.TreeNode.call(this,iconNode,false);
  this._alwaysCache=true;
};
goog.inherits(models.Model1.FriendsNode,models.Model1.TreeNode);

models.Model1.FriendsNode.prototype.exploreNode = function(model){
  if(this.isOpen()){
    model.raiseOpenFolderEvent();
    return;
  }
  // Else need to make a FB api call
  var fbObj=model.fb;
  var _node=this;
  var fbOpenFriendsCB = function(apiResponse){
    _node.addFriendsFromFBresponse(apiResponse,fbObj);
    model.raiseOpenFolderEvent();
  };
  fbObj.api('/me/friends',fbOpenFriendsCB);
};

models.Model1.FriendsNode.prototype.addFriendsFromFBresponse = 
    function(apiResp,fbObj){
      var friends=apiResp['data'];
      var fbSession=fbObj.getSession();
      goog.asserts.assert(common.helpers.isArray(friends),
          'Expected API call for friend list to return array');
      for(var i=0;i<friends.length;i++){
        var friendObj=friends[i];
        var friendIcon = new common.PersonIcon(friendObj['name'],
            models.Model1.getProfilePicUrl(friendObj['id'],fbSession),
            0,0,friendObj['id'],friendObj['name']);
        var friendNode = new models.Model1.PersonNode(friendIcon);
        this.addChildren(friendNode);
      }
      this._isOpen=true;
    };

// --- End implementation of FriendsNode ---------

// --- Begin implementation of PersonNode -------
models.Model1.PersonNode = function(iconNode){
  goog.asserts.assert(iconNode instanceof common.PersonIcon);
  models.Model1.TreeNode.call(this,iconNode,false);
};
goog.inherits(models.Model1.PersonNode,models.Model1.TreeNode);

models.Model1.PersonNode.prototype.exploreNode = function(model){
  if(this.isOpen()){
    model.raiseOpenFolderEvent();
    return;
  }
  var curIcon=this.iconNode;
  var fbSession=model.fb.getSession();
  var photoOfPersonIcon = new common.PhotosOfPersonIcon('Photos of '+
      common.helpers.getFirstName(curIcon.name),
      models.Model1.getProfilePicUrl(curIcon.fbId,fbSession),0,0);
  var photoOfPersonNode = new models.Model1.PhotosOfPersonNode(
      photoOfPersonIcon);

  this.addChildren(photoOfPersonNode);

  // Now get the albums of the person
  var fbId=curIcon.fbId;
  var fbObj=model.fb;
  var _node=this;
  var fbGetAlbumsCB = function(apiResp){
    _node.addAlbumsFromFBresponse(apiResp,fbObj);
    model.raiseOpenFolderEvent();
  };
  fbObj.api('/'+fbId+'/albums',fbGetAlbumsCB);
};

models.Model1.PersonNode.prototype.addAlbumsFromFBresponse = 
function(apiResp,fbObj){
  var albums=apiResp['data'];
  var fbSession=fbObj.getSession();
  goog.asserts.assert(common.helpers.isArray(albums),
      'Expected API call for albums to return array');
  for(var i=0;i<albums.length;i++){
    var albumObj=albums[i];
    var albumIcon = new common.AlbumIcon(albumObj['name'],
        models.Model1.getAlbumPicUrl(albumObj['id'],fbSession),
        0,0,albumObj['id']);
    var albumNode = new models.Model1.AlbumNode(albumIcon);
    this.addChildren(albumNode);
  }
  this._isOpen=true;
};

// --- End implementation of PersonNode ---------

// --- Begin implementation of AlbumNode -------
models.Model1.AlbumNode = function(iconNode){
  goog.asserts.assert(iconNode instanceof common.AlbumIcon);
  models.Model1.TreeNode.call(this,iconNode,false);
};
goog.inherits(models.Model1.AlbumNode,models.Model1.TreeNode);

// --- End implementation of AlbumNode -------


// --- Begin implementation of PhotosOfPersonNode -------
models.Model1.PhotosOfPersonNode = function(iconNode){
  goog.asserts.assert(iconNode instanceof common.PhotosOfPersonIcon);
  models.Model1.TreeNode.call(this,iconNode,false);
};
goog.inherits(models.Model1.PhotosOfPersonNode,models.Model1.TreeNode);

// --- End implementation of PhotosOfPersonNode -------

// ---- End implementation of supporting objects -----
