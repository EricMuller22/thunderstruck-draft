if (Meteor.isClient) {
  Meteor.subscribe("games");
  Meteor.subscribe("drafters");
  Meteor.subscribe("picks");

  // Schedule
  Template.games.games = function() {
    return Games.find({}).fetch();
  };

  var canDraft = function() {
    return Meteor.userId() === nextUser().id;
  };

  Template.games.canDraft = canDraft;

  Template.games.events({
    'click .game-select' : function (evt) {
      if (canDraft()) {
        Games.update({_id: evt.target.id}, {$set: {owner: username()}});
        var drafterInfo = Drafters.findOne({draftOrder: currentPick()});
        Picks.insert({
          "user": drafterInfo,
          "game": Games.findOne({_id: evt.target.id}),
          "pick": currentPick()
        });
        var gameInfo = Games.findOne({_id: evt.target.id});
        Drafters.update({_id: drafterInfo._id}, {$set: {pick: gameInfo.game}});
      }
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
  var nextUser = function() {
    return Drafters.findOne({draftOrder: currentPick()});
  }

  Template.users.drafters = function() {
    return Drafters.find({}, {sort: {draftOrder: 1}}).fetch();
  };

  /* To do: highlight drafter in user list - probably better accomplished with jQuery */
  Template.users.ifDrafting = function(pickNumber) {
    if (pickNumber === currentPick()) {
      return 'class=drafting';
    }
    else if (pickNumber < currentPick()) {
      return 'class=drafted';
    }
    return "";
  };

  Template.users.image = function(avatar, pick) {
    var imgUrl;
    if (pick !== "") {
      imgUrl = "teams/" + pick + ".gif";
    }
    else {
      imgUrl = avatar;
    }
    return imgUrl;
  }

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

  var next = function() {
    return currentPick() <= maxPick()
  };

  Template.announce.next = next;
  Template.drafting.next = next;

  Template.announce.lastPick = function () {
    var pick = currentPick();
    if (pick > 1 && pick <= maxPick()) {
      var lastPick = Picks.findOne({"pick": pick - 1});
      return "Last pick: " + lastPick.user.username + " selected " + lastPick.game.game;
    }
    return "";
  };
}