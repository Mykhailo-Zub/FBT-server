const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const appPort = 4004;
const mongoUrl =
  "mongodb+srv://admin:Admin12345@cluster0.7ebsb.mongodb.net/fbt-server?retryWrites=true&w=majority";

const app = express();
app.use(cors());

const corsOptions = {
  origin: "http://localhost:3000",
  optionSuccessStatus: 200,
};

//Model
const UsersSchema = new mongoose.Schema({
  name: String,
  password: String,
  family_title: String,
  adult: String,
});

// mongoose.model("Heroes", HeroesSchema);

const Users = mongoose.model("Users", UsersSchema);

//Controller

const getAll = (req, res) => {
  Users.find()
    .exec()
    .then((users) => res.json(users))
    .catch((err) => res.status(500).json(err));
};

const getOne = (req, res) => {
  Users.findOne({ _id: req.params.id })
    .exec()
    .then((user) => res.json(user))
    .catch((err) => res.status(500).json(err));
};

const create = (req, res) => {
  Users.create(req.body)
    .then((createUser) => res.json(createUser))
    .catch((err) => res.status(500).json(err));
};

const update = (req, res) => {
  Users.updateOne({ _id: req.params.id }, { $set: req.body })
    .exec()
    .then((user) => res.json(user))
    .catch((err) => res.status(500).json(err));
};

const remove = (req, res) => {
  Users.findOneAndRemove({ _id: req.params.id })
    .exec()
    .then(() => res.json({ success: true }))
    .catch((err) => res.status(500).json(err));
};

//Routs
app.get("/users", cors(corsOptions), getAll);
app.get("/users/:id", cors(corsOptions), getOne);
app.post("/users", cors(corsOptions), create);
app.put("/users/:id", cors(corsOptions), update);
app.delete("/users/:id", cors(corsOptions), remove);

mongoose.set("useFindAndModify", false);
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(appPort, () => console.log(`Listening on port ${appPort} ...`))
  )
  .catch((err) => console.error(`Error connecting to mongo: ${mongoUrl}`, err));
