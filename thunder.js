// Schedule
Games = new Meteor.Collection("games");
Drafters = new Meteor.Collection("drafters");
Picks = new Meteor.Collection("picks");

Games.allow({
  update: function() {
    return true;
  }
});

Picks.allow({
  insert: function(userId) {
    return true;
  }
});

Accounts.config({
  sendVerificationEmail: false,
  forbidClientAccountCreation: true
});