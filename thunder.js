// Schedule
Games = new Meteor.Collection("games");
Drafters = new Meteor.Collection("drafters");
Picks = new Meteor.Collection("picks");

Games.allow({
  update: function(userId, doc, fieldNames) {
    return (fieldNames.length === 1 && fieldNames[0] === "owner");
  }
});

Drafters.allow({
  update: function(userId, doc, fieldNames) {
    return (fieldNames.length === 1 && fieldNames[0] === "pick" && userId === doc.id);
  }
});

// helpers - to do - split into a separate file?
var currentPick = function() {
  return Picks.find({}).count() + 1;
};

var nextUser = function() {
  return Drafters.findOne({draftOrder: currentPick()});
}

var canDraft = function(userId) {
  return userId === nextUser().id;
};

Picks.allow({
  insert: function(userId) {
    return canDraft(userId);
  }
});

Accounts.config({
  sendVerificationEmail: false,
  forbidClientAccountCreation: true
});