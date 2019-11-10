const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 80;

// Serve any static files built by React
app.use(express.static(path.join(__dirname, "frontend/build")));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
});

app.listen(port, () => console.log(`Listening on port ${port}`));
