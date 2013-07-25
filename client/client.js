if (Meteor.isClient) {
  Meteor.subscribe("games");
  Meteor.subscribe("drafters");
  Meteor.subscribe("picks");

  // Schedule
  Template.games.games = function() {
    return Games.find({}).fetch();
  };

  Template.games.events({
    'click .game' : function (evt) {
      // console.log(Meteor.userId());
    }
  });

  var currentPick = function() {
    return Picks.find({}).count() + 1;
  };

  // Users
  Template.users.drafters = function() {
    return Drafters.find({}).fetch();
  };

  Template.users.isDrafting = function(drafter) {
    return false;
  };

  var username = function() {
    return "Bro";
  };

  Template.drafting.username = username;

  // Announcements
  Template.announce.upNext = function () {
    return "On the clock: " + username()
  };

  Template.announce.lastPick = function () {
    var pick = currentPick();
    if (pick > 1) {
      return "Last pick: Dude selected Jaguars";
    }
    return "";
  };
}