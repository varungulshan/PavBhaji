// This class contains objects that are used to transfer information between
// model and view classes.

goog.provide('common.IconNode');
goog.provide('common.PersonIcon');
goog.provide('common.AlbumIcon');
goog.provide('common.FriendsIcon');
goog.provide('common.PhotoIcon');
goog.provide('common.PhotosOfPersonIcon');

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
};

common.PersonIcon = function(iconText,iconImgUrl,fileDepth,fileIdx, 
                                 fbId,name){
  common.IconNode.call(this,iconText,iconImgUrl,fileDepth,fileIdx);
  this.fbId=fbId; // Facebook UID of the person, type string
  this.name=name;
};
goog.inherits(common.PersonIcon,common.IconNode); // This call simulates
// inheritance, and needs to be made after the class declaration.

common.AlbumIcon = function(iconText,iconImgUrl,fileDepth,fileIdx,
                         fbId){
  common.IconNode.call(this,iconText,iconImgUrl,fileDepth,fileIdx);
  this.fbId=fbId; // Facebook UID of the album, type string
};
goog.inherits(common.AlbumIcon,common.IconNode);

common.FriendsIcon = function(iconText,iconImgUrl,fileDepth,fileIdx){
  common.IconNode.call(this,iconText,iconImgUrl,fileDepth,fileIdx);
  // No extra properties yet
};
goog.inherits(common.FriendsIcon,common.IconNode);

common.PhotoIcon = function(iconText,iconImgUrl,fileDepth,fileIdx,
                         fbId){
  common.IconNode.call(this,iconText,iconImgUrl,fileDepth,fileIdx);
  this.fbId=fbId; // Facebook UID of the photo, type string
};
goog.inherits(common.PhotoIcon,common.IconNode);

common.PhotosOfPersonIcon = function(iconText,iconImgUrl,fileDepth,fileIdx){
  common.IconNode.call(this,iconText,iconImgUrl,fileDepth,fileIdx);
};
goog.inherits(common.PhotosOfPersonIcon,common.IconNode);
