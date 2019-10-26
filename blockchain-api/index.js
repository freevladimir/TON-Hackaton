const express = require("express");
const { exec } = require("child_process");

const app = express();

app.listen(3000, () => {
  console.log("Server ready");
});

app.post("/api/create-wallet", (req, res) => {
  exec("ls -la", (err, stdout, stderr) => {
    if (err) {
      res.send(err).status(500);
      return;
    }
    console.log(stdout);

    res.sendStatus(200);
  });
});

app.get("/api/get-balance", (req, res) => {
  if (err) {
    res.send(err).status(500);
    return;
  }
  console.log(stdout);

  res.sendStatus(200);
});

app.post("/api/transaction", (req, res) => {
  const { sender, recipient, amount } = req.body;
  if (err) {
    res.send(err).status(500);
    return;
  }
  console.log(stdout);

  res.sendStatus(200);
});
