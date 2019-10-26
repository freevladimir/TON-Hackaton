const express = require("express");
const app = express();

const blockchainApi = require("./api");

const TelegramBot = require("node-telegram-bot-api");

const token = "1067249757:AAElGAQa6ldsA6YwjNTdw0MBAMRAL-mZdqk";

var bot = new TelegramBot(token, { polling: true });

app.listen(3001, () => {
  console.log("Server ready");
});

// бд, будет тут или настоящая потом
const db = {
  users: {
    id: {
      telegramId: "123",
      walledId: "xxxx"
    }
  }
};

const Auction = require("auction");
const auction = new Auction();

// проверка жизни аукциона
setInterval(async () => {
  if (auction.isExprired()) {
    auction.users.forEach(user => {
      bot.sendMessage(user, "Аукцион закончился, но скоро начнем новый");
      // ...
    });
    auction.close();
    auction.create();
  }
}, 1000);

/*
  Bot
*/
bot.on("message", function(msg, match) {
  var fromId = msg.from.id;
  bot.sendMessage(fromId, "здарова");
});

// test code for Bot
/*app.get("t", async m => {
  const userId = m.id;
  if (m.new) {
    m.send("Hi");
    try {
      const { walledId } = db.users.find(user => user.telegramId === userId);
      if (!walledId) {
        const newWalletId = await blockchainApi.createWallet();
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

  // сколько отправить
  if (m.text === "number") {
    const senderWallet = db.users[m.id].walletId;

    try {
      await blockchainApi.sendTransaction({
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
});*/
