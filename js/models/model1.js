/**
 * This file implements a concrete model class, obeying the inferface
 * of AbstractModel class
 */

goog.provide('models.Model1');

goog.require('common.CommentObj');
goog.require('common.LikeObj');
goog.require('common.TagObj');
goog.require('common.helpers');
goog.require('common.IconNode');
goog.require('common.PersonIcon');
goog.require('common.AlbumIcon');
goog.require('common.FriendsIcon');
goog.require('common.PhotoIcon');
goog.require('common.PhotosOfPersonIcon');
goog.require('models.AbstractModel');
goog.require('goog.asserts');
goog.require('goog.date');

// ---- Begin implementation of Model1 ---------
models.Model1 = function(){
  models.AbstractModel.call(this);
  this.userId='';
  this._openNodeList=[];
  this._openNodeIdx=-1;
  this._currentState=models.Model1.State.folderView;
  this._homeNode=null;
  this.userNode=null;
  this.friendsNode=null;
  this.friendsInfo=[]; // Array of objects of type {id,picUrl,name}
  this.friendNameById={}; // Map between friend Id and name
      // friendNameById['id']='friend name';
  this._userInfo={}; // Object of type {id,picUrl,name}
  this._busy=false;
};
goog.inherits(models.Model1,models.AbstractModel);
goog.exportSymbol('models.Model1',models.Model1);

models.Model1.prototype.initialize = function(fbObj,userId){
  goog.asserts.assert(typeof userId === 'string');
  this.fb=fbObj;
  this.userId=userId;

  var rootIcon=new common.IconNode('root','',0,-1);
  var rootNode=new models.Model1.TreeNode(rootIcon,false);

  var homeIcon=new common.IconNode('home','',0,0);
  homeIcon.navText='P:/'; // Setting it manually right now
  var homeNode=new models.Model1.HomeNode(homeIcon); 

  rootNode.addChildren(homeNode);
  rootNode._isOpen=true; // Need this hacky private member access once!

  this._homeNode=homeNode;
  this._openNodeList=[rootNode]; //Array of open nodes, each node should be open
  this._openNodeIdx=0; // Index of currently open node
  this._currentState=models.Model1.State.folderView;
  this.gotoIcon(homeIcon); // All the async initialization of model happens here
};
//goog.exportProperty(models.Model1,'initialize',
    //models.Model1.prototype.initialize);
goog.exportSymbol('models.Model1.prototype.initialize',
    models.Model1.prototype.initialize);

models.Model1.prototype.asyncInitialization = function(){
  // Need to load friend list, user name in async initialization
  var fbObj=this.fb;

  var friendsQuery=fbObj.Data.query(
      'SELECT uid,name,pic FROM user WHERE uid IN '+
      '(SELECT uid2 FROM friend WHERE uid1=me())');

  var userNameQuery=fbObj.Data.query(
      'SELECT uid,name,pic FROM user WHERE uid=me()');

  var _model=this;

  var fbNamesQueryCB = function(){
    var friends=friendsQuery.value;
    if(friends['length']===undefined){
      friends=[];
    }
    for(var i=0;i<friends.length;i++){
      var friendObj=friends[i];
      var friendId=friendObj['uid'];
      var picUrl=friendObj['pic'];
      _model.friendsInfo.push(
          {'id':friendId,'picUrl':picUrl,'name': friendObj['name']});
      _model.friendNameById[friendId]=friendObj['name'];
    }

    var you=userNameQuery.value;
    goog.asserts.assert(you['length']===1,
        'User name query should return only one results');
    _model._userInfo={'name': you[0]['name'],'id': you[0]['uid'],
        'picUrl': you[0]['pic']};
    _model.userNode.iconNode.iconImgUrl=_model._userInfo['picUrl'];

    var numFriends = friends.length;
    var homeMetaInfo = _model._homeNode.iconNode.getMetaInfo();
    homeMetaInfo.contextBarText = 'You have '+numFriends.toString()+
        ' friends and some photos';
    _model.raiseOpenFolderEvent();
  };

  fbObj.Data.waitOn([friendsQuery,userNameQuery],fbNamesQueryCB);
};

models.Model1.prototype.getUserName = function(){
  return this._userInfo['name'];
};

models.Model1.prototype.getUserId = function(){
  return this._userInfo['id'];
};

models.Model1.prototype.getOpenIcon = function(){
  goog.asserts.assert(this._openNodeList.length>0); // to make sure model has
      // been initialized
  var openNode=this._openNodeList[this._openNodeIdx];
  return openNode.iconNode;
};

models.Model1.prototype.closeCurrentPhoto = function(){
  if(this._currentState!=models.Model1.State.photoView){
    throw Error(
        'Expected model to be in photo view state on model.closeCurrentPhoto');
  }
  goog.asserts.assert(this._openNodeIdx===(this._openNodeList.length-1));
  this._openNodeList[this._openNodeIdx].closeNode();
  this._openNodeList=this._openNodeList.slice(0,this._openNodeIdx);
  this._openNodeIdx--;
  this._currentState=models.Model1.State.folderView;
};

models.Model1.prototype.getCurrentPathIcons = function(){
  goog.asserts.assert(this._openNodeList.length>=2); // 'root' and 'home'
      // nodes should always be open
  var pathIcons=[];
  var openNodeList=this._openNodeList;
  var lastEntry=openNodeList.length;
  if(this._currentState===models.Model1.State.photoView){
    lastEntry--;
    // when in photoView state, do not include the photoIcon in the
    // list of icons in the path
  }
  for(var i=1;i<lastEntry;i++){
    pathIcons.push(openNodeList[i].iconNode);
  }
  return pathIcons;
};

models.Model1.prototype.gotoIcon = function(targetIcon){
  if(this._busy){
    return -1; // Means request not processed
  }
  this._busy=true;
  goog.asserts.assert(targetIcon instanceof common.IconNode);
  var parentIconDepth=targetIcon.fileDepth-1;
  var iconChildIdx=targetIcon.fileIdx;

  goog.asserts.assert(parentIconDepth>=0);
  goog.asserts.assert(parentIconDepth<this._openNodeList.length);

  var parentNode=this._openNodeList[parentIconDepth];
  var nodeToOpen=parentNode.getChild(iconChildIdx);

  this._openNode(nodeToOpen);
  if(nodeToOpen.isLeaf){
    this._currentState=models.Model1.State.photoView;
  }else{
    this._currentState=models.Model1.State.folderView;
  }
  return 0; // Means processed successfully
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

models.Model1.prototype.raiseOpenPhotoEvent = function(){
  this._openPhotoEvent.notify();
  this._busy=false;
};

models.Model1.prototype.raiseCommentAddedEvent = function(){
  this._addCommentEvent.notify();
  this._busy=false;
};

models.Model1.prototype.raiseOpenFolderEvent = function(){
  goog.asserts.assert(this._openNodeList[this._openNodeIdx].isOpen(),
      'Expected node to be opened on the openFolder notification');
  this._openFolderEvent.notify();
  this._busy=false;
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

models.Model1.prototype.attachToAddCommentEvent = function(eventHandler){
  goog.asserts.assert(typeof eventHandler === 'function',
      'Event handler expected to be a function');
  this._addCommentEvent.attach(eventHandler);
};

models.Model1.prototype.getLastPostedComment = function(){
  if(this._currentState!=models.Model1.State.photoView){
    throw Error(
        'Expected model to be in photo view state on getLastPostedComment');
  }
  var photoNode=this._openNodeList[this._openNodeIdx];
  goog.asserts.assert(photoNode instanceof models.Model1.PhotoNode);
  var numComments=photoNode.comments.length;
  var commentObj={};
  if(numComments>0){
    commentObj=photoNode.comments[numComments-1];
  }
  return commentObj;
};

models.Model1.prototype.addComment = function(message){
  if(this._busy){
    return -1; // Means request not processed
  }
  this._busy=true;
  if(this._currentState!=models.Model1.State.photoView){
    throw Error(
        'Expected model to be in photo view state on model.addComment');
  }
  var photoNode=this._openNodeList[this._openNodeIdx];
  goog.asserts.assert(photoNode instanceof models.Model1.PhotoNode);
  var photoIcon=photoNode.iconNode;
  var photoId=photoIcon.fbId;
  var fbObj=this.fb;
  var _model=this;
  var commentAddedCB = function(apiResp){
    // TODO: correct error handling if comment cant be added
    if(!apiResp || apiResp['error']){
      alert('Comment could not be added');
    }
    //photoNode.addComment(apiResp['id'],_model); 
    photoNode.addComment(message,_model); // will add this
        // comment to the comments list and raise the model event
  };
  fbObj.api('/'+photoId+'/comments','post',{'message': message},
      commentAddedCB);
};

models.Model1.prototype.getCurrentPhoto = function(){
  if(this._currentState!=models.Model1.State.photoView){
    throw Error(
        'Expected model to be in photo view state on model.getCurrentPhoto');
  }
  var photoNode=this._openNodeList[this._openNodeIdx];
  goog.asserts.assert(photoNode instanceof models.Model1.PhotoNode);
  var photoIcon=photoNode.iconNode;
  var photoObj = new common.PhotoObj(photoIcon.fullImgUrl,
      photoIcon.photoCaption,photoNode.comments,photoIcon.width,
      photoIcon.height,photoNode.likes,photoNode.tags);

  return photoObj;
};

models.Model1.prototype.getCurrentIcons = function(){
  if(this._currentState!==models.Model1.State.folderView){
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
  // Note we are not creating copy of icons, instead just passing the icons
  // that the model uses to the view, assumption is that view will not alter
  // them
};

//  --- Static values/methods of Model1 ------------

// implementing a Enum type
models.Model1.State = {'folderView': 0, 'photoView': 1};

models.Model1.resourceDir = '../resources/'; // This path needs to be
    // relative to the document which is loaded, need to be more
    // smarter on how to set it

models.Model1.numRecentAlbums = 50;
models.Model1.numRecentPhotos = 50;

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

models.Model1.invalidPageError = function(opt_message){
  var message='';
  if(opt_message){
    message=opt_message;
  }
  throw Error('Invalid page requested: '+message);
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

  var recentPhotosPic = models.Model1.resourceDir+'recent.jpg';
  var recentPhotosIcon = new common.RecentPhotosIcon(recentPhotosPic,0,0);
  var recentPhotosNode = new models.Model1.RecentPhotosNode(recentPhotosIcon);

  var recentAlbumsPic = models.Model1.resourceDir+'recent.jpg';
  var recentAlbumsIcon = new common.RecentAlbumsIcon(recentAlbumsPic,0,0);
  var recentAlbumsNode = new models.Model1.RecentAlbumsNode(recentAlbumsIcon);
  
  this.addChildren([userNode,friendsNode,recentAlbumsNode,recentPhotosNode]);

  this._isOpen=true;
  model.asyncInitialization();
  //this.loadFriends(model);
  //this._isOpen=true;
  //model.raiseOpenFolderEvent();

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

  var fbObj=model.fb;
  var friendsInfo=model.friendsInfo;
  var friendNameById=model.friendNameById;
  var fbSession=fbObj.getSession();

  for(var i=0;i<friendsInfo.length;i++){
    var currentId=friendsInfo[i]['id'];
    var picUrl=friendsInfo[i]['picUrl'];
    var currentName=friendNameById[currentId];
    var friendIcon = new common.PersonIcon(currentName,
        picUrl,0,0,currentId,currentName);
    var friendNode = new models.Model1.PersonNode(friendIcon);
    this.addChildren(friendNode);
  }
  var numFriends = friendsInfo.length;
  var metaInfo = this.iconNode.getMetaInfo();
  metaInfo.contextBarText = 'Showing '+numFriends.toString()+' friends';
  this._isOpen=true;
  model.raiseOpenFolderEvent();
};

// --- End implementation of FriendsNode ---------

// --- Being implementation of RecentPhotosNode -----
models.Model1.RecentPhotosNode = function(iconNode){
  goog.asserts.assert(iconNode instanceof common.RecentPhotosIcon);
  models.Model1.TreeNode.call(this,iconNode,false);
  this._alwaysCache=true;
};
goog.inherits(models.Model1.RecentPhotosNode,models.Model1.TreeNode);

models.Model1.RecentPhotosNode.prototype.exploreNode = function(model){
  if(this.isOpen()){
    model.raiseOpenFolderEvent();
    return;
  }
  // Else need to make a FB api call
  var fbObj=model.fb;
  var _node=this;

  var fbOpenRecentPhotosCB = function(apiResponse){
    _node.addPhotosFromFBresponse(apiResponse,fbObj);
    model.raiseOpenFolderEvent();
  };
  var queryString=
      'SELECT caption,src,src_big,src_big_height,src_big_width,object_id '+
      'FROM photo WHERE pid IN'+
      '(SELECT pid FROM photo_tag WHERE subject IN'+
      '(SELECT uid2 FROM friend WHERE uid1 = me()) '+
      'order by created desc limit '+models.Model1.numRecentPhotos.toString()+
      ')';
  fbObj.api({method: 'fql.query',query: queryString},fbOpenRecentPhotosCB);
  // TODO: check if the above call can be made simpler/faster
  // also set the numComments and numIcons of the child nodes
};

// This function is exact copy from AlbumNode function
models.Model1.RecentPhotosNode.prototype.addPhotosFromFBresponse =
function(apiResp){
  var photos=apiResp;
  if(photos['length']===undefined){photos=[];} // This happens when album
      // has no photos
  //goog.asserts.assert(common.helpers.isArray(photos));
  for(var i=0;i<photos.length;i++){
    var photoObj=photos[i];
    var photoCaption='';
    if(photoObj['caption']){photoCaption=photoObj['caption'];}
    var photoIcon = new common.PhotoIcon(photoCaption,photoObj['src'],0,0,
        photoObj['object_id'],photoObj['src_big'],photoCaption,
        photoObj['src_big_width'],photoObj['src_big_height']);

    var photoNode = new models.Model1.PhotoNode(photoIcon);
    this.addChildren(photoNode);
  }
  var metaInfo = this.iconNode.getMetaInfo();
  metaInfo.contextBarText = 'Recently tagged friends';
  this._isOpen=true;
};

// --- End implementation of RecentPhotosNode ---------



// --- Being implementation of RecentAlbumsNode -----
models.Model1.RecentAlbumsNode = function(iconNode){
  goog.asserts.assert(iconNode instanceof common.RecentAlbumsIcon);
  models.Model1.TreeNode.call(this,iconNode,false);
  this._alwaysCache=true;
};
goog.inherits(models.Model1.RecentAlbumsNode,models.Model1.TreeNode);

models.Model1.RecentAlbumsNode.prototype.exploreNode = function(model){
  if(this.isOpen()){
    model.raiseOpenFolderEvent();
    return;
  }
  // Else need to make a FB api call
  var fbObj=model.fb;
  var _node=this;

  var fbOpenRecentAlbumsCB = function(apiResponse){
    _node.addAlbumsFromFBresponse(apiResponse,fbObj,model.friendNameById);
    model.raiseOpenFolderEvent();
  };

  var timeThresh = new goog.date.Date();
  var monthInterval = new goog.date.Interval(0,0,-7); 
      // 0 years, 0 months, -7 days
  timeThresh.add(monthInterval);
  var queryString='SELECT aid,name,object_id,owner FROM album WHERE '+
      'modified > '+(timeThresh.getTime()/1000).toString()+
      ' AND owner IN (SELECT uid2 FROM friend WHERE uid1 = me()) '+
      ' order by modified desc limit '+models.Model1.numRecentAlbums.toString();
  fbObj.api({method: 'fql.query',query: queryString},fbOpenRecentAlbumsCB);
  // TODO: check if the above call can be made simpler/faster
  // seems like the time threshold doesnt affect anything
  // Also add query for numComments and numLikes
};

models.Model1.RecentAlbumsNode.prototype.addAlbumsFromFBresponse = 
function(apiResp,fbObj,friendNameById){
  var albums=apiResp;
  if(apiResp['length']===undefined){albums=[];} // this happens when user
      // has no albums
  var fbSession=fbObj.getSession();
  //goog.asserts.assert(common.helpers.isArray(albums),
      //'Expected API call for albums to return array');
  for(var i=0;i<albums.length;i++){
    var albumObj=albums[i];
    var albumName='';
    if(albumObj['name']){albumName=albumObj['name'];}
    var iconText = common.helpers.shortenText(albumName,6) +
                   ' by '+friendNameById[albumObj['owner']];
    var albumIcon = new common.AlbumIcon(iconText,
        models.Model1.getAlbumPicUrl(albumObj['object_id'],fbSession),
        0,0,albumObj['aid'],albumObj['object_id'],albumName);
    var albumNode = new models.Model1.AlbumNode(albumIcon);
    this.addChildren(albumNode);
  }
  var metaInfo=this.iconNode.getMetaInfo();
  metaInfo.contextBarText = 'Recently updated albums by friends';
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
      common.helpers.getFirstName(curIcon.name).toLowerCase(),
      curIcon.iconImgUrl,0,0,
      curIcon.name,curIcon.fbId);
  var photoOfPersonNode = new models.Model1.PhotosOfPersonNode(
      photoOfPersonIcon);

  this.addChildren(photoOfPersonNode);

  // Now get the albums of the person
  var fbId=curIcon.fbId;
  var fbObj=model.fb;
  var _node=this;

  var albumsQuery=fbObj.Data.query(
      'SELECT aid,name,object_id,cover_pid,type FROM album WHERE owner='+fbId);

  var albumCoverQuery=fbObj.Data.query(
      'SELECT src,pid FROM photo WHERE pid IN (SELECT cover_pid FROM {0})'
      ,albumsQuery);

  var numCommentsQuery=fbObj.Data.query(
      'SELECT time,object_id FROM comment WHERE ' +
      'object_id IN (SELECT object_id FROM {0} WHERE type <> "profile")',
      albumsQuery);
  // TODO: is it possible to directly obtain the count instead of 
  // having return the fields and count them. Because if the count is huge
  // (like 5000 comments on a photo, then the query will be truncated to 4500!)

  var numLikesQuery=fbObj.Data.query(
      'SELECT user_id,object_id FROM like WHERE '+
      'object_id IN (SELECT object_id FROM {0} WHERE type <> "profile")',
      albumsQuery);
  // Note: the type <> profile constraint is needed, because FB somehow treats
  // certain profile pic albums separately, and those cause this FQL
  // query to crash (i.e no callback is ever called, causing app to hang!)

  var fbMultiQueryCB = function(){
    _node.addAlbumsFromFBresponse(albumsQuery,albumCoverQuery,numCommentsQuery,
                                  numLikesQuery);
    model.raiseOpenFolderEvent();
  };

  fbObj.Data.waitOn([albumsQuery,albumCoverQuery,numCommentsQuery,numLikesQuery]
                    ,fbMultiQueryCB);
  //fbObj.api({method: 'fql.query',query: queryString},fbGetAlbumsCB);
};

models.Model1.PersonNode.prototype.addAlbumsFromFBresponse = 
function(albumsQ,coverQ,commentsQ,likesQ){
  var albumsResp=albumsQ['value'];
  if(albumsResp['length']===undefined){albumsResp=[];} // this happens when user
      // has no albums
  var coverResp=coverQ['value'];
  if(coverResp['length']===undefined){coverResp=[];}
  goog.asserts.assert(coverResp.length===albumsResp.length,
      'Did not retrive same number of albums and album covers!');

  var likesResp=likesQ['value'];
  if(likesResp['length']===undefined){likesResp=[];}
  var commentsResp=commentsQ['value'];
  if(commentsResp['length']===undefined){commentsResp=[];}

  var numLikesHash = common.helpers.buildCountHash('object_id',albumsResp,
                     likesResp);
  var numCommentsHash = common.helpers.buildCountHash('object_id',albumsResp,
                       commentsResp);

  var numAlbums=0;
  for(var i=0;i<albumsResp.length;i++){
    var albumObj=albumsResp[i];
    var albumName='';
    if(albumObj['name']){albumName=albumObj['name'];}
    var albumId = albumObj['object_id'];
    if(albumId!=='0'){ 
      // Some profile pic albums get an id of 0, and are not accessible
      // via apps, so have to check that specially here, inelegant FB :(
      var albumIcon = new common.AlbumIcon(albumName,
          coverResp[i]['src'],0,0,albumObj['aid'],albumId,albumName);
      albumIcon.numComments = numCommentsHash[albumId];
      albumIcon.numLikes = numLikesHash[albumId];
      var albumNode = new models.Model1.AlbumNode(albumIcon);
      this.addChildren(albumNode);
      numAlbums++;
    }
  }
  var metaInfo = this.iconNode.getMetaInfo();
  metaInfo.contextBarText = 'Showing '+numAlbums.toString()+ ' albums';
  this._isOpen=true;
};

// --- End implementation of PersonNode ---------

// --- Begin implementation of AlbumNode -------
models.Model1.AlbumNode = function(iconNode){
  goog.asserts.assert(iconNode instanceof common.AlbumIcon);
  models.Model1.TreeNode.call(this,iconNode,false);
};
goog.inherits(models.Model1.AlbumNode,models.Model1.TreeNode);

models.Model1.AlbumNode.prototype.exploreNode = function(model){
  if(this.isOpen()){
    model.raiseOpenFolderEvent();
    return;
  }

  // Prepare for API call to get photos
  var curIcon=this.iconNode;
  var fbObj=model.fb;
  var _node=this;
  var fqlId=curIcon.fqlId;
  var fbId=curIcon.fbId;
  
  var photosQuery = fbObj.Data.query(
      'SELECT caption,src,src_big,src_big_height,src_big_width,object_id '+
      'FROM photo WHERE aid="'+fqlId+'"');

  var albumCommentsQ = fbObj.Data.query(
      'SELECT fromid,time,text FROM comment WHERE object_id='+fbId);

  var albumLikesQ = fbObj.Data.query(
      'SELECT uid,name FROM user WHERE uid IN '+
      '(SELECT user_id FROM like WHERE object_id='+fbId+')'
      );

  var namesQuery=fbObj.Data.query(
      'SELECT uid,name FROM user WHERE '+
      'uid IN (SELECT fromid FROM {0})',
      albumCommentsQ);

  var photoLikesQ=fbObj.Data.query(
      'SELECT user_id,object_id FROM like WHERE object_id IN '+
      '(SELECT object_id FROM {0})',photosQuery);

  var photoCommentsQ=fbObj.Data.query(
      'SELECT time,object_id FROM comment WHERE object_id IN '+
      '(SELECT object_id FROM {0})',photosQuery);
 
  var fbMultiQueryCB = function(){
    _node.addPhotosFromFBresponse(albumCommentsQ,albumLikesQ,namesQuery,
        photosQuery,photoLikesQ,photoCommentsQ);
    model.raiseOpenFolderEvent();
  };

  fbObj.Data.waitOn([albumCommentsQ,albumLikesQ,namesQuery,photosQuery,
                     photoLikesQ,photoCommentsQ],fbMultiQueryCB);
  //fbObj.api({method: 'fql.query',query: queryString},fbGetPhotosCB);

};

models.Model1.AlbumNode.prototype.addPhotosFromFBresponse =
function(albumCommentsQ,albumLikesQ,namesQ,photosQ,photoLikesQ,photoCommentsQ){
  var photos=photosQ['value'];
  if(photos['length']===undefined){photos=[];} // This happens when album
      // has no photos
  var photoLikes=photoLikesQ['value'];
  if(photoLikes['length']===undefined){photoLikes=[];}
  var photoComments=photoCommentsQ['value'];
  if(photoComments['length']===undefined){photoComments=[];}

  var numLikesHash = common.helpers.buildCountHash('object_id',photos,
                                                   photoLikes);
  var numCommentsHash = common.helpers.buildCountHash('object_id',photos,
                                                      photoComments);
  for(var i=0;i<photos.length;i++){
    var photoObj=photos[i];
    var photoId = photoObj['object_id'];
    var photoCaption='';
    if(photoObj['caption']){photoCaption=photoObj['caption'];}
    var photoIcon = new common.PhotoIcon(photoCaption,photoObj['src'],0,0,
        photoId,photoObj['src_big'],photoCaption,
        photoObj['src_big_width'],photoObj['src_big_height']);
    photoIcon.numComments = numCommentsHash[photoId];
    photoIcon.numLikes = numLikesHash[photoId];
    var photoNode = new models.Model1.PhotoNode(photoIcon);
    this.addChildren(photoNode);
  }

  // Setup the meta info for the album
  var numPhotos = photos.length;
  var metaInfo = this.iconNode.getMetaInfo();
  metaInfo.contextBarText = 'Showing '+numPhotos.toString()+' photos';
  metaInfo.commentsArray = [];
  metaInfo.likesArray = [];
  
  var albumComments=albumCommentsQ['value'];
  if(albumComments['length']===undefined){albumComments=[];}
  var albumLikes=albumLikesQ['value'];
  if(albumLikes['length']===undefined){albumLikes=[];}
  var names=namesQ['value'];
  if(names['length']===undefined){names=[];}

  // Process comments on album first
  var friendIdToName={};
  for(var i=0;i<names.length;i++){
    friendIdToName[names[i]['uid']]=names[i]['name'];
  }
  for(var i=0;i<albumComments.length;i++){
    var fromId=albumComments[i]['fromid'];
    var fromName=friendIdToName[fromId];
    if(fromName===undefined){fromName='Anonymous';}
    var commentObj = new common.CommentObj(albumComments[i]['time'],
                                           albumComments[i]['text'],
                                           fromId,fromName);
    metaInfo.commentsArray.push(commentObj);
  }

  // Process likes on album
  for(var i=0;i<albumLikes.length;i++){
    var likeObj = new common.LikeObj(albumLikes[i]['uid'],
                                     albumLikes[i]['name']);
    metaInfo.likesArray.push(likeObj);
  }

  this._isOpen=true;
};

// --- End implementation of AlbumNode -------


// --- Begin implementation of PhotosOfPersonNode -------
models.Model1.PhotosOfPersonNode = function(iconNode){
  goog.asserts.assert(iconNode instanceof common.PhotosOfPersonIcon,
      'Expected Photos of person icon in photos of person node');
  models.Model1.TreeNode.call(this,iconNode,false);
};
goog.inherits(models.Model1.PhotosOfPersonNode,models.Model1.TreeNode);

models.Model1.PhotosOfPersonNode.prototype.exploreNode = function(model){
   if(this.isOpen()){
    model.raiseOpenFolderEvent();
    return;
  }
  
  // Prepare for API call to get photos
  var curIcon=this.iconNode;
  var fbObj=model.fb;
  var _node=this;
  var fbId=curIcon.fbId;
 
  var fbGetPhotosCB = function(apiResp){
    _node.addPhotosFromFBresponse(apiResp);
    model.raiseOpenFolderEvent();
  };
  var queryString=
      'SELECT caption,src,src_big,src_big_height,src_big_width,object_id '+
      'FROM photo WHERE pid IN '+
      '(SELECT pid FROM photo_tag WHERE subject="'+fbId+'")';
  fbObj.api({method: 'fql.query',query: queryString},fbGetPhotosCB);
  // TODO: get num likes and comments (might be very expensive, so perhaps
  // better to not get them (unless you figure out a more efficient FQL
  // query for directly finding the counts)
  //fbObj.api('/'+fbId+'/photos',fbGetPhotosCB);

};

models.Model1.PhotosOfPersonNode.prototype.addPhotosFromFBresponse =
function(apiResp){
  var photos=apiResp;
  if(photos['length']===undefined){photos=[];} // This happens when no photos
      // of the user are available
  photos.reverse(); // Photos are returned in reverse chronological order
      // for some reason
  //goog.asserts.assert(common.helpers.isArray(photos),
      //'Expect FB api call for photos of person to return an array');
  for(var i=0;i<photos.length;i++){
    var photoObj=photos[i];
    var photoCaption='';
    if(photoObj['caption']){photoCaption=photoObj['caption'];}
    var photoIcon = new common.PhotoIcon(photoCaption,photoObj['src'],0,0,
        photoObj['object_id'],photoObj['src_big'],photoCaption,
        photoObj['src_big_width'],photoObj['src_big_height']);

    var photoNode = new models.Model1.PhotoNode(photoIcon);
    this.addChildren(photoNode);
  }
  var numPhotos=photos.length;
  var metaInfo = this.iconNode.getMetaInfo();
  metaInfo.contextBarText = 'Showing '+numPhotos.toString()+ ' photos';
  this._isOpen=true;
};


// --- End implementation of PhotosOfPersonNode -------

// --- Begin implementation of PhotoNode -------
models.Model1.PhotoNode = function(iconNode){
  goog.asserts.assert(iconNode instanceof common.PhotoIcon);
  models.Model1.TreeNode.call(this,iconNode,true);
  this._alwaysCache=true; // is useful because often a photo will be viewed
      // in an album, and user will go back and forth
  this.comments=[]; // Not storing this in the icon yet
  this.likes=[];
  this.tags=[];
};
goog.inherits(models.Model1.PhotoNode,models.Model1.TreeNode);

models.Model1.PhotoNode.prototype.exploreNode = function(model){
   if(this.isOpen()){
    model.raiseOpenPhotoEvent();
    return;
  }
  
  // Prepare for API call to get info of photo (like comments on it)
  var curIcon=this.iconNode;
  var fbObj=model.fb;
  var _node=this;
  var fbId=curIcon.fbId;
 
  var commentsQuery=fbObj.Data.query(
      'SELECT fromid,time,text FROM comment WHERE object_id="'+
      fbId+'"');

  var likesQuery=fbObj.Data.query(
      'SELECT uid,name FROM user WHERE uid IN '+
      '(SELECT user_id FROM like WHERE object_id="'+fbId+'")'
      );

  var tagsQuery=fbObj.Data.query(
      'SELECT subject,xcoord,ycoord,text FROM photo_tag WHERE pid IN '+
      '(SELECT pid FROM photo WHERE object_id="'+fbId+'")'
      );

  var namesQuery=fbObj.Data.query(
      'SELECT uid,name FROM user WHERE '+
      'uid IN (SELECT fromid FROM {0})',
      commentsQuery);

  // Leave the query below commented, it explains an interesting
  // use in the WHERE clause
  //var namesQuery=fbObj.Data.query(
      //'SELECT uid,name FROM user WHERE '+
      //'(uid IN (SELECT fromid FROM {0})) OR '+
      //'(uid IN (SELECT subject FROM {1}))',
      //commentsQuery,tagsQuery);

  var fbMultiQueryCB = function(){
    _node.processPhotoQueries(commentsQuery,likesQuery,tagsQuery,
                              namesQuery);   
    model.raiseOpenPhotoEvent();
  };

  fbObj.Data.waitOn([commentsQuery,likesQuery,tagsQuery,namesQuery],
      fbMultiQueryCB);
};

models.Model1.PhotoNode.prototype.processPhotoQueries =
function(commentQ,likesQ,tagsQ,namesQ){
  // Process comments
  this.comments=[];
  var commentQ_resp=commentQ.value;
  var namesQ_resp=namesQ.value;
  if(commentQ_resp['length']!==undefined){
    //goog.asserts.assert(namesQ_resp['length']!==undefined);
    if(namesQ_resp['length']===undefined){
      namesQ_resp=[];
      // It can happen that this is undefined (even though there are comments
      // on the photo because some people have disabled platform apps 
      // So it is not possible to recover any names for such users. 
      // TODO: Check if this can happen else where also
    }
    var friendIdToName={};
    for(var i=0;i<namesQ_resp.length;i++){
      friendIdToName[namesQ_resp[i]['uid']]=namesQ_resp[i]['name'];
    }
    var numComments=commentQ_resp.length;
    for(var i=0;i<numComments;i++){
      var fromId=commentQ_resp[i]['fromid'];
      var fromName=friendIdToName[fromId];
      if(fromName===undefined){fromName='Anonymous';} // This happens when 
      // some users have disabled platform apps, so their user name is not
      // available to apps

      var commentObj = new common.CommentObj(commentQ_resp[i]['time'],
                                             commentQ_resp[i]['text'],
                                             fromId,fromName);          
      this.comments.push(commentObj);
    }
  }

  var likesQ_resp=likesQ.value;
  this.likes=[];
  if(likesQ_resp['length']!==undefined){
    for(var i=0;i<likesQ_resp.length;i++){
      var iLikeResp = likesQ_resp[i];
      var likeObj = new common.LikeObj(iLikeResp['uid'],iLikeResp['name']);
      this.likes.push(likeObj);
    }
  }
  
  var tagsQ_resp=tagsQ.value;
  this.tags=[];
  if(tagsQ_resp['length']!==undefined){
    var numTags=tagsQ_resp.length;
    for(var i=0;i<numTags;i++){
      var tagRespI = tagsQ_resp[i];
      var tagObj = new common.TagObj(tagRespI['xcoord'],
                                     tagRespI['ycoord'],
                                     tagRespI['subject'],
                                     tagRespI['text']);
      this.tags.push(tagObj);
    }
  }
  var metaInfo=this.iconNode.getMetaInfo();
  metaInfo.commentsArray=this.comments;
  metaInfo.likesArray=this.likes;
  this._isOpen=true;
};

/**
 * closeNode(), function to close a node, overriding default one
 */
models.Model1.PhotoNode.prototype.closeNode = function(){
  // Dont close nodes for which alwaysCache flag is set
  if(!this._alwaysCache){
    goog.asserts.assert(this._children.length===0,
        'Photo node should not have any children');        
    this._isOpen=false;
    this.comments=[];
    this.likes=[];
    this.tags=[];
  }
};

models.Model1.PhotoNode.prototype.addComment = function(message,model){
  var curTime=(new goog.date.Date()).getTime()/1000; // TODO: this time might
      // be in a different representation that the one returned by FQL
  curTime=curTime.toString();

  var commentObj=new common.CommentObj(curTime,message,model.getUserId(),
                                       model.getUserName());
  this.comments.push(commentObj);
  model.raiseCommentAddedEvent();
};

// --- End implementation of PhotoNode -------


// ---- End implementation of supporting objects -----
