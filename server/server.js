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

    var users = [
      {
        email: 'daniel@test.com',
        password: 'test',
        name: 'Daniel',
        avatar: 'daniel.jpg'
      },
      {
        email: 'ross@test.com',
        password: 'test',
        name: 'Ross',
        avatar: 'ross.jpg'
      },
      {
        email: 'stuart@test.com',
        password: 'test',
        name: 'Stuart',
        avatar: 'stu.jpg'
      },
      {
        email: 'julian@test.com',
        password: 'test',
        name: 'Julian',
        avatar: 'julian.jpg'
      }
    ];

    var randomDraftSpot = function() {
      function random() { return Math.floor(Math.random() * 4) + 1; }
      var randomPick = random();
      while (Meteor.users.find({'profile.draftOrder': randomPick}).count() !== 0) {
        randomPick = random();
      }
      return randomPick;
    }

    Meteor.users.remove({});
    _.map(users,
      function(user) {
        Accounts.createUser({
          email: user.email,
          password: user.password,
          profile: {
            name: user.name,
            avatar: user.avatar,
            draftOrder: randomDraftSpot()
          }
        });

        // Alert users that the draft is Live - requires email package and a configured $MAIL_URL
        // Meteor docs on the email package demonstrate sending async from client
        Email.send({
          "from": "eric@unexplorednovelty.com",
          "to": user.email,
          "subject": "Thunderstruck Draft is LIVE",
          "html":
            '<p>Username</p>' +
            '<p>' + user.email + '</p>' +
            '<p>Password<p>' +
            '<p>' + user.password + '</p>' + 
            '<a href="http://thunderstruck-draft.meteor.com">WHATTHEFUCKAREYOUWAITINGFOR?</a>'
        });
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
        pick: ""
      });
    });
    Meteor.users.find({}, {sort: {draftOrder: -1}}).forEach(function(user) {
      Drafters.insert({
        username: user.profile.name,
        draftOrder: Meteor.users.find({}).count() * 2 - user.profile.draftOrder + 1,
        id: user._id,
        avatar: user.profile.avatar,
        pick: ""
      });
    });

    Picks.remove({});
  });

  Meteor.publish("games", function() {
  	return Games.find({}, {sort: {month: 1, day: 1}});
  });
  Meteor.publish("drafters", function() {
    return Drafters.find({}, {sort: {draftOrder: 1}});
  });
  Meteor.publish("picks", function() {
    return Picks.find({});
  });

  // Allow async email send from client
  Meteor.methods({
    sendGroupEmail: function (subject, html) {
      this.unblock();
      Meteor.users.find({}).forEach( function(user) {
        Email.send({
          to: user.emails[0].address,
          from: "eric@unexplorednovelty.com",
          subject: subject,
          html: html
        });
      });
    }
  });
}