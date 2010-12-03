// This file contains a misc collection of helper objects, mainly used
// for interaction between view and icons (and sometimes model)

goog.provide('common.contextBarObj');
goog.provide('common.commentObj');
goog.provide('common.likeObj');
goog.provide('common.tagObj');

/**
 * Class to store information to be shown in context bar.
 * Has following fields:
 *  isLikeable: Denotes whether a like button should be shown
 *              in the context bar when the icon is open.
 *  displayText: The text that should be shown in the context bar
 *      when the icon is open. Might need to be more generic than just text
 *      (could be html), will fix that later
 *  likesArray: Array of objects of type common.likeObj
 *      people who likes the correponding icon. For icons that cannot be liked
 *      this array will be empty.
 *  commentsArray: Array of objects of type common.commentObj
 */
common.contextBarObj = function(){
  this.isLikeable = false;
  this.displayText = ''; 
  this.likesArray = []; 
  this.commentsArray = []; 
};

/**
 * Class to store information about a comment
 */
common.commentObj = function(time,message,fromId,fromName){
  this.created_time=time;
  this.message=message; // The text of the comment
  var profileUrl = common.helpers.getProfileUrl(fromId);
  this.from={'id':fromId,
             'name':fromName,
             'profileUrl':profileUrl
            };
};

/**
 * Class to store information about a like
 */
common.likeObj =  function(id,name){
  this.id=id; // id of person liking
  this.name=name; // name of person liking
  this.profileUrl = common.helpers.getProfileUrl(id);
};

/**
 * Class to store information about a tag
 */
common.tagObj =  function(xcoord,ycoord,id,name){
  this.xcoord=xcoord;
  this.ycoord=ycoord;
  this.id=id; // facebook id of tagged person (can be empty for non-person tags)
  this.name=name; // text associated with tag (name of person if a person, else
      // the text with the tag)
  this.profileUrl = common.helpers.getProfileUrl(id); // This url can be invalid
      // if tag is not a person. TODO
};

