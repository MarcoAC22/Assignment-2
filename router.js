const axios = require("axios");
const express = require("express");
const Room = require("./Room");
const Profile = require("./Profile");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("./User");

const connectEnsureLogin = require("connect-ensure-login");
const passport = require("passport");

const rooms = require("./rooms.json");
const { json } = require("express");

router.get("/rooms", async (req, res) => {
  const rooms = await Room.find();

  res.render("pages/rooms/index", {
    roomsArray: rooms,
    isAuthenticated: req.isAuthenticated(),
  });
});

router.get("/rooms/:id", async (req, res) => {
  const room = await Room.findOne(
    { data: { $elemMatch: { room: req.params.id } } },
    { "data.$": 1, name: 1 }
  );
  res.render("pages/rooms/details", {
    roomObject: room,
    isAuthenticated: req.isAuthenticated(),
  });
});

router.get(
  "/profile",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    User.findById(req.user.id)
      .populate("profile")
      .exec((err, user) => {
        if (err) {
          res.send(err);
        } else {
          res.render("pages/profile", {
            profileObject: user.profile,
            isAuthenticated: req.isAuthenticated(),
          });
        }
      });
  }
);

router.post(
  "/created_rooms",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    const roomsArray = new Room(rooms);
    await roomsArray.save();
    res.send(roomsArray);
  }
);

router.post("/temp_rooms", async (req, res) => {
  Room.insertMany(rooms, function (err, docs) {
    if (err) {
      res.send({ data: err });
    } else {
      res.send({ data: docs });
    }
  });
});

router.get("/login", (req, res) => {
  res.render("pages/login", {
    title: "Login",
    isAuthenticated: req.isAuthenticated(),
  });
});

router.get("/sign_up", (req, res) => {
  res.render("pages/sign_up", {
    title: "Sign Up",
    isAuthenticated: req.isAuthenticated(),
  });
});

router.post("/sign_up", (req, res) => {
  const { username, password, email, firstname, lastname, image } = req.body;
  User.register(
    new User({ username: username, email: email }),
    password,
    (err, user) => {
      if (err) {
        res.send(err);
      } else {
        Profile.create({ firstname, lastname, image }, (err, profile) => {
          if (err) {
            res.send(err);
          } else {
            user.profile = profile;
            user.save((err) => {
              if (err) {
                res.send(err);
              } else {
                res.redirect("/login");
              }
            });
          }
        });
      }
    }
  );
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/rooms",
  }),
  (req, res) => {
    console.log(req.user);
  }
);

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get("/", async (req, res) => {
  const rooms = await Room.find();

  let room = rooms[Math.floor(Math.random() * rooms.length)];

  res.render("pages/index", {
    roomObject: room,
    isAuthenticated: req.isAuthenticated(),
  });
});

router.get(
  "/add_room",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    res.render("pages/rooms/add_room", {
      isAuthenticated: req.isAuthenticated(),
    });
  }
);

router.post("/add_room", (req, res) => {
  Room.create({ title: req.body.title, description: req.body.description });
  res.redirect("/rooms");
});

router.get(
  "/edit_room/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    Room.findById(req.params.id, (err, post) => {
      if (err) {
        res.send(err);
      } else {
        res.render("pages/rooms/edit_room", {
          isAuthenticated: req.isAuthenticated(),
          roomObject: post,
        });
      }
    });
  }
);
router.post("/edit_room/:id", (req, res) => {
  console.log(req.body);
  console.log(req.params.id);
  Room.findByIdAndUpdate(req.params.id, req.body, (err, post) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect("/rooms");
    }
  });
});

router.get(
  "/rooms/delete/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    Room.findByIdAndDelete(req.params.id, (err, post) => {
      if (err) {
        res.send(err);
      } else {
        res.redirect("/rooms");
      }
    });
  }
);

module.exports = router;
