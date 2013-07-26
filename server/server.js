if (Meteor.isServer) {
  Meteor.startup(function () {
  	// Schedule
    // to do - strip this into a separate file
    var games = [
      {
        game: "Titans",
        month: 9,
        day: 15,
        time: "12:00 PM"
      },
      {
        game: "Seahawks",
        month: 9,
        day: 29,
        time: "12:00 PM"
      },
      {
        game: "Rams",
        month: 10,
        day: 13,
        time: "12:00 PM"
      },
      {
        game: "Colts",
        month: 11,
        day: 3,
        time: "7:30 PM"
      },
      {
        game: "Raiders",
        month: 11,
        day: 17,
        time: "12:00 PM"
      },
      {
        game: "Jaguars",
        month: 11,
        day: 24,
        time: "12:00 PM"
      },
      {
        game: "Patriots",
        month: 12,
        day: 1,
        time: "3:25 PM"
      },
      {
        game: "Broncos",
        month: 12,
        day: 22,
        time: "12:00 PM"
      }
    ];

  	Games.remove({});
  	for (var i = 0; i < games.length; i++) {
  		Games.insert({
  			game: games[i].game,
        month: games[i].month,
        day: games[i].day,
        time: games[i].time,
  			owner: ""
  		});
  	}

    Meteor.users.remove({});
    Accounts.createUser({
      email: "daniel@test.com",
      password: "test",
      profile: {
        name: "Daniel",
        draftOrder: 1,
        avatar: "daniel.jpg",
        initials: "DB"
      }
    });
    Accounts.createUser({
      email: "ross@test.com",
      password: "test",
      profile: {
        name: "Ross",
        draftOrder: 2,
        avatar: "ross.jpg",
        initials: "RB"
      }
    });
    Accounts.createUser({
      email: "julian@test.com",
      password: "test",
      profile: {
        name: "Julian",
        draftOrder: 3,
        avatar: "julian.jpg",
        initials: "JE"
      }
    });
    Accounts.createUser({
      email: "stuart@test.com",
      password: "test",
      profile: {
        name: "Stuart",
        draftOrder: 4,
        avatar: "stu.jpg",
        initials: "SS"
      }
    });

    var snakeCount = function() {
      var users = Meteor.users.find({}).count();
      var games = Games.find({}).count();
      var drafters = Drafters.find({}).count();
      return games/users - drafters;
    };

    Drafters.remove({});
    Meteor.users.find({}, {sort: {draftOrder: 1}}).forEach(function(user) {
      Drafters.insert({
        username: user.profile.name,
        draftOrder: user.profile.draftOrder,
        id: user._id,
        avatar: user.profile.avatar,
        initials: user.profile.initials
      });

      // Alert users that the draft is Live
      /* Email.send({
        "from": "eric@unexplorednovelty.com",
        "to": user.email,
        "subject": "Thunderstruck Draft is LIVE",
        "html": '<a href="site-link"<h1>WHATTHEFUCKAREYOUWAITINGFOR?</h1></a>'
      }); */
    });

    Meteor.users.find({}, {sort: {draftOrder: -1}}).forEach(function(user) {
      Drafters.insert({
        username: user.profile.name,
        draftOrder: Meteor.users.find({}).count() * 2 - user.profile.draftOrder + 1,
        id: user._id,
        avatar: user.profile.avatar,
        initials: user.profile.initials
      });
    });
  });

  Meteor.publish("games", function() {
  	return Games.find({}, {sort: {month: 1, day: 1}});
  });
  Meteor.publish("drafters", function() {
    return Drafters.find({}, {sort: {draftOrder: 1}});
  });
  Meteor.publish("nowDrafting", function() {
    return {"currentPick": currentPick};
  });
}