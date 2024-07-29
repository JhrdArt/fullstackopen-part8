const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    minLength: 3,
  },
  favoriteGenre: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", schema);
