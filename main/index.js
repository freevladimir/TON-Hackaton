const express = require("express");

const app = express();

app.listen(3001, () => {
  console.log("Server ready");
});

const BLOCKCHAIN_API = "localhost:3000";

const db = {
  users: {
    id: {
      telegramId: "123",
      walledId: "xxxx"
    }
  }
};

// test code for Bot

class Auction {
  constructor() {
    this.state = {
      // created: Date
      // name: 'Picture'
      // id: 5,
      users: []
    };
  }

  create(params) {
    this.state = params;
  }

  isExprired() {
    const AUCTION_LIFETIME = 10 * 60 * 1000; // 10 mins

    if (auction.created + AUCTION_LIFETIME > Date.parse(new Date())) {
      return true;
    }

    return false;
  }

  addUser(id) {
    this.state.users.push(id);
  }

  close() {
    this.state = {
      users: []
    };
  }
}

const auction = new Auction();

const bot = {};
setInterval(async () => {
  if (auction.isExprired()) {
    auction.users.forEach(user => {
      bot.send(user, "Аукцион закончился");
      // ...
    });
    auction.close();
    auction.create();
  }
}, 1000);

app.get("t", async m => {
  const userId = m.id;
  if (m.new) {
    m.send("Hi");
    try {
      const { walledId } = db.users.find(user => user.telegramId === userId);
      if (!walledId) {
        const newWalletId = await createWallet();
        m.send(`Your wallet is ${newWalletId}`);
      } else {
        m.send(`У тебя уже есть кошелек ${walletId}`);
      }
      return;
    } catch (error) {
      console.log(error);
      m.send(`Sorry, you have error ${error}`);
      return;
    }
  }

  if (a.current) {
    m.send("We have auction now, do you want to join?");
  }

  if (m.text === "yes") {
    // create wallet
    m.send("Твоя ставка:");
  }

  if (m.text === "no") {
    m.send("Ну ладно:( В другой раз");
  }

  if (m.text === "number") {
    const senderWallet = db.users[m.id].walletId;

    try {
      await sendTransaction({
        sender: senderWallet,
        recipient: OUR_VALLET,
        amount: 200
      });

      auction.addUser(m.id);
      m.send("ок");
    } catch (error) {
      console.log(error);
      m.send("Ой, ошибка");
    }
  }
});

async function createWallet() {
  try {
    const response = await axios.post(`${BLOCKCHAIN_API}/api/create-wallet`);
    const { walletId } = response.data;

    return walletId;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getBalance() {
  try {
    const response = await axios.get(`${BLOCKCHAIN_API}/api/get-balance`);
    const { balance } = response.data;
    return balance;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function sendTransaction(sender, recipient, amount) {
  try {
    const response = await axios.post(`${BLOCKCHAIN_API}/api/transaction`, {
      sender,
      recipient,
      amount
    });

    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
