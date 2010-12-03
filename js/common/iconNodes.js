// This class contains objects that are used to transfer information between
// model and view classes.

goog.provide('common.IconNode');
goog.provide('common.PersonIcon');
goog.provide('common.AlbumIcon');
goog.provide('common.FriendsIcon');
goog.provide('common.PhotoIcon');
goog.provide('common.PhotosOfPersonIcon');
goog.provide('common.PhotoObj');

goog.require('common.IconMetaInfo');

/**
 * Class for representing icon objects, they can be sub-classed into different
 * types depending on the need.
 */
common.IconNode = function(iconText,iconImgUrl,fileDepth,fileIdx){
  this.iconText=iconText;
  this.iconImgUrl=iconImgUrl;
  this.fileDepth=fileDepth; // Used by model to locate node in tree
  this.fileIdx=fileIdx;     // Used by model to locate node in tree
  this.navText=''; // text to be used in the navigation bar, the subclasses
                   // will fill this out appropriately
  this.toolTipText=''; // text to be used for showing tool tip, subclasses
                       // will fill it out appropriately
  this._metaInfo= new common.IconMetaInfo();
};

common.IconNode.prototype.getMetaInfo = function(){
  return this._metaInfo;
  // This function can be overridden by sub-classes if needed, but 
  // probably wont be needed
};

// --- Static values of common.IconNode ---------
common.IconNode.IndexType={'byIconText': 0,'byIconNumber': 1};
// --- End static values of common.IconNode -----

common.RecentPhotosIcon = function(iconImgUrl,fileDepth,fileIdx){
  common.IconNode.call(this,'Recently Tagged',iconImgUrl,fileDepth,fileIdx);
  this.navText='Tagged';
  this.toolTipText='View photos of recently tagged friends';
  this.pageJumpType=common.IconNode.IndexType.byIconNumber;
};
goog.inherits(common.RecentPhotosIcon,common.IconNode); // This call simulates
// inheritance, and needs to be made after the class declaration.

common.RecentAlbumsIcon = function(iconImgUrl,fileDepth,fileIdx){
  common.IconNode.call(this,'Recent albums',iconImgUrl,fileDepth,fileIdx);
  this.navText='Rec. Albums';
  this.toolTipText='View recently added/updated albums by your friends';
  this.pageJumpType=common.IconNode.IndexType.byIconNumber;
};
goog.inherits(common.RecentAlbumsIcon,common.IconNode); // This call simulates
// inheritance, and needs to be made after the class declaration.


common.PersonIcon = function(iconText,iconImgUrl,fileDepth,fileIdx, 
                                 fbId,name){
  common.IconNode.call(this,iconText,iconImgUrl,fileDepth,fileIdx);
  this.fbId=fbId; // Facebook UID of the person, type string
  this.name=name;
  this.navText=common.helpers.getFirstName(name);
  this.toolTipText='View albums and tagged photos of '+name;
  this.pageJumpType=common.IconNode.IndexType.byIconNumber;
};
goog.inherits(common.PersonIcon,common.IconNode); // This call simulates
// inheritance, and needs to be made after the class declaration.

common.AlbumIcon = function(iconText,iconImgUrl,fileDepth,fileIdx,
                         fqlId,fbId,caption){
  common.IconNode.call(this,iconText,iconImgUrl,fileDepth,fileIdx);
  this.fqlId=fqlId; // The aid of the album used for FQL queries
      // is different from the fbId used for graph API queries
  this.fbId=fbId;
  this.caption=caption;
  //this.navText=common.helpers.shortenText(iconText,10);
  this.navText=iconText;
  if(!common.helpers.isEmptyString(caption)){
    this.toolTipText='View photos in album: '+caption;
  }
  else{
    this.toolTipText='View photos in this (unnamed) album';
  }
  this.pageJumpType=common.IconNode.IndexType.byIconNumber;
};
goog.inherits(common.AlbumIcon,common.IconNode);

common.FriendsIcon = function(iconText,iconImgUrl,fileDepth,fileIdx){
  common.IconNode.call(this,iconText,iconImgUrl,fileDepth,fileIdx);
  this.navText='Friends';
  this.toolTipText='View your friends and their photos';
  this.pageJumpType=common.IconNode.IndexType.byIconText;
};
goog.inherits(common.FriendsIcon,common.IconNode);

common.PhotoIcon = function(iconText,iconImgUrl,fileDepth,fileIdx,
                         fbId,fullImgUrl,photoCaption,width,height){
  common.IconNode.call(this,iconText,iconImgUrl,fileDepth,fileIdx);
  this.fbId=fbId; // Facebook UID of the photo, type string
  this.navText=''; // dont need any navText for this icon as it never
      // goes to the nav bar
  this.fullImgUrl=fullImgUrl; // link to full view of image
  this.photoCaption=photoCaption;
  this.width = width;
  this.height = height;
  this.toolTipText = photoCaption;
  this.pageJumpType=common.IconNode.IndexType.byIconNumber;
};
goog.inherits(common.PhotoIcon,common.IconNode);

common.PhotosOfPersonIcon = function(iconText,iconImgUrl,fileDepth,fileIdx,
                                     name,fbId){
  common.IconNode.call(this,iconText,iconImgUrl,fileDepth,fileIdx);
  this.name=name; // The name of the person who's photos these are
  this.fbId=fbId; // fbId of the person who's photos need to be seen
  this.pageJumpType=common.IconNode.IndexType.byIconNumber;

  // TODO: handle this better, this one could crash
  // if a person is actually named you.
  if(name==='You'){
    this.navText='Photos of you';
    this.toolTipText='View photos where you are tagged'; 
  }else{
    this.navText='Photos of '+common.helpers.getInitials(name);
    this.toolTipText='View photos where '+
        common.helpers.getFirstName(name).toLowerCase() +' is tagged';
  }
};
goog.inherits(common.PhotosOfPersonIcon,common.IconNode);

/**
 * Class for representing a photo. Stores the photo url, comments, tags etc.
 * that are needed for displaying the photo
 */
common.PhotoObj = function(imgUrl,caption,commentArray,width,height,
                           likes,tags){
  this.imgUrl=imgUrl;
  this.caption=caption;
  this.commentArray=commentArray; 
  // commentArray is an array of objects of type common.commentObj
  this.likes=likes; 
  // likes is an array of objects of type common.likeObj
  this.tags=tags; 
  // tags is an array of objects of type common.tagObj

  this.width = width;
  this.height = height;
};


