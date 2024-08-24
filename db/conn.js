const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/durga_store")
  .then(() => console.log("server was connected"))
  .catch(() => console.log("server not connected"));
