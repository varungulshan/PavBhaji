// This class contains objects that are used to transfer information between
// model and view classes.

goog.provide('common.IconNode');
goog.provide('common.PersonIcon');
goog.provide('common.AlbumIcon');
goog.provide('common.FriendsIcon');
goog.provide('common.PhotoIcon');
goog.provide('common.PhotosOfPersonIcon');
goog.provide('common.PhotoObj');

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
  this.curPageNum=0;
  this.nextAvailable=false;
};

common.PersonIcon = function(iconText,iconImgUrl,fileDepth,fileIdx, 
                                 fbId,name){
  common.IconNode.call(this,iconText,iconImgUrl,fileDepth,fileIdx);
  this.fbId=fbId; // Facebook UID of the person, type string
  this.name=name;
  this.navText=common.helpers.getFirstName(name);
};
goog.inherits(common.PersonIcon,common.IconNode); // This call simulates
// inheritance, and needs to be made after the class declaration.

common.AlbumIcon = function(iconText,iconImgUrl,fileDepth,fileIdx,
                         fbId){
  common.IconNode.call(this,iconText,iconImgUrl,fileDepth,fileIdx);
  this.fbId=fbId; // Facebook UID of the album, type string
  this.navText=common.helpers.shortenText(iconText,10);
};
goog.inherits(common.AlbumIcon,common.IconNode);

common.FriendsIcon = function(iconText,iconImgUrl,fileDepth,fileIdx){
  common.IconNode.call(this,iconText,iconImgUrl,fileDepth,fileIdx);
  this.navText='Friends';
};
goog.inherits(common.FriendsIcon,common.IconNode);

common.PhotoIcon = function(iconText,iconImgUrl,fileDepth,fileIdx,
                         fbId,fullImgUrl,photoCaption){
  common.IconNode.call(this,iconText,iconImgUrl,fileDepth,fileIdx);
  this.fbId=fbId; // Facebook UID of the photo, type string
  this.navText=''; // dont need any navText for this icon as it never
      // goes to the nav bar
  this.fullImgUrl=fullImgUrl; // link to full view of image
  this.photoCaption=photoCaption;
};
goog.inherits(common.PhotoIcon,common.IconNode);

common.PhotosOfPersonIcon = function(iconText,iconImgUrl,fileDepth,fileIdx,
                                     name,fbId){
  common.IconNode.call(this,iconText,iconImgUrl,fileDepth,fileIdx);
  this.name=name; // The name of the person who's photos these are
  this.navText='Photos of '+common.helpers.getInitials(name);
  this.fbId=fbId; // fbId of the person who's photos need to be seen
};
goog.inherits(common.PhotosOfPersonIcon,common.IconNode);

/**
 * Class for representing a photo. Stores the photo url, comments, tags etc.
 * that are needed for displaying the photo
 */
common.PhotoObj = function(imgUrl,caption,commentArray){
  this.imgUrl=imgUrl;
  this.caption=caption;
  this.commentArray=commentArray; 
  // commentArray is an array of objects, each object has the following fields:
  // [1] created_time: time of post
  // [2] id: of the message, not of the person who posted
  // [3] message: this field is the string that has the comment.
  // [4] from={id,name} : the from field is an object itself, 
  //                      it tells who posted the comment
  // The above format is actually what FB returns on an API call
  // so just used the same format
};


