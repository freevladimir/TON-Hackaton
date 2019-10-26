const express = require("express");
const { exec } = require("child_process");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(3000, () => {
  console.log("Server ready");
});

app.post("/api/create-wallet", (req, res) => {
  exec("ls -la", (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      res.send(err).status(500);
      return;
    }
    console.log(stdout);

    res.send({
      walletId: "111"
    });
  });
});

app.get("/api/get-balance", (req, res) => {
  exec("ls -la", (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      res.send(err).status(500);
      return;
    }
    console.log(stdout);

    res.send({
      balance: 120
    });
  });
});

app.post("/api/transaction", (req, res) => {
  const { sender, recipient, amount } = req.body;
  console.log(req.body);

  exec("ls -la", (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      res.send(err).status(500);
      return;
    }
    console.log(stdout);

    res.send({
      status: "ok"
    });
  });
});
