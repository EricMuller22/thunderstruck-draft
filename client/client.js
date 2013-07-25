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

  // Picks
  var currentPick = function() {
    return Picks.find({}).count() + 1;
  };

  var maxPick = function() {
    return Games.find({}).count();
  }

  // Users
  Template.users.drafters = function() {
    return Drafters.find({}).fetch();
  };

  Template.users.isDrafting = function(drafter) {
    return false;
  };

  var username = function() {
    if (Drafters.findOne({draftOrder: currentPick()})) {
      return Drafters.findOne({draftOrder: currentPick()}).username;
    }
    return "";
  };

  Template.drafting.username = username;

  // Announcements
  var upNext = function () {
    var next = username();
    if (next) {
      return "On the board: " + next;
    }
    return "";
  };

  Template.announce.upNext = upNext;

  var next = function(){
    return currentPick() <= maxPick()
  }

  Template.announce.next = next;
  Template.drafting.next = next;

  Template.announce.lastPick = function () {
    var pick = currentPick();
    if (pick > 1 && pick <= maxPick()) {
      return "Last pick: Dude selected Jaguars";
    }
    return "";
  };
}