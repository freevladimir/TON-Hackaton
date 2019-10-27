const express = require("express");
const app = express();

const blockchainApi = require("./api");

const TelegramBot = require("node-telegram-bot-api");

const token = "1067249757:AAElGAQa6ldsA6YwjNTdw0MBAMRAL-mZdqk";

var bot = new TelegramBot(token, { polling: false });
bot.sendMessage = (...params) => {
  console.log(params);
};

// 1 наш токен = 0.1 грамма
const RATE = 0.1;

app.listen(3001, () => {
  console.log("Server ready");
});

// бд, будет тут или настоящая потом
const db = {
  users: [
    {
      // telegramId: "123",
      // walledId: "xxxx"
    }
  ]
};

const Auction = require("./auction");
const auction = new Auction();
const OUR_VALLET = "1233";

// первый акцион
auction.create({ title: "Picture", price: 490 });

// проверка жизни аукциона
setInterval(async () => {
  console.log("Auction:", auction.state);

  if (!auction.state.calculating && auction.isExprired()) {
    auction.state.calculating = true;
    console.log("Close auction");

    const { price, title } = auction.state;
    let calcPrice = price;

    auction.state.bids
      .sort((a, b) => {
        return a.amount > b.amount;
      })
      .forEach(bid => {
        const { userId, amount } = bid;

        const user = db.users.find(u => u.telegramId === userId);

        if (calcPrice - amount >= 0) {
          calcPrice = calcPrice - amount;

          try {
            // await blockchainApi.sendTransaction(user.wallet.name, OUR_VALLET,amount);
            const percent = Math.floor((amount / price) * 100);
            bot.sendMessage(
              user.telegramId,
              `Поздравляем, ты купил ${percent}% от ${title}`
            );
          } catch (error) {
            console.log(error);
            bot.sendMessage(user.telegramId, "Ой, что-то пошло не так");
          }
        } else {
          bot.sendMessage(
            user.telegramId,
            "Аукцион закончился, но ты ничего не выиграл:( Но ничего, мыскоро начнем новый"
          );
        }
      });

    auction.close();
    auction.create({ name: "Picture " + Math.random() });
  }
  console.log("Auction is running");
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

function test() {
  db.users.push({
    telegramId: "2121"
  });

  db.users.push({
    telegramId: "212231"
  });

  db.users.push({
    telegramId: "2111221"
  });

  db.users.push({
    telegramId: "2111221"
  });
  auction.bid("2121", 200);
  auction.bid("212231", 600);
  auction.bid("2111221", 200);
  auction.bid("2111221", 2020);
}

test();
