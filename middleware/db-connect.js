const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/potluckparty", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

module.exports = mongoose.connection
