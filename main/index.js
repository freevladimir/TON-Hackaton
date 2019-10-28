const express = require("express");
const app = express();

let isFinish = false;
const blockchainApi = require("./api");

/*const TelegramBot = require("node-telegram-bot-api");

const token = "1067249757:AAElGAQa6ldsA6YwjNTdw0MBAMRAL-mZdqk";

var bot = new TelegramBot(token, { polling: false });
bot.sendMessage = (...params) => {
  console.log(params);
};*/

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
      // wallet: "xxxx"
    }
  ]
};

const pic = ["UTON 3", "Мишки в лесу", "Вангог", "На пляже", "Мальчик мечтает"];

const Auction = require("./auction");
const auction = new Auction();
const OUR_VALLET = "1233";

// первый акцион
auction.create({
  title: "UTON tree",
  price: 4900
});

// проверка жизни аукциона
setTimeout(async () => {
  isFinish = true;
  // console.log("Auction:", auction.state);

  // if (!auction.state.calculating && auction.isExprired()) {
  console.log("Close auction");

  console.log(auction.state);
  console.log(db.users);

  const { price, title } = auction.state;
  let calcPrice = price;

  auction.state.bids
    .sort((a, b) => {
      return a.amount > b.amount;
    })
    .forEach(async bid => {
      const { userId, amount } = bid;

      const user = db.users.find(u => u.telegramId === userId);

      if (calcPrice - amount >= 0) {
        calcPrice = calcPrice - amount;

        try {
          // await blockchainApi.sendTransaction(user.wallet.name, OUR_VALLET,amount);
          const percent = Math.floor((amount / price) * 100);
          bot.sendMessage(
            user.telegramId,
            `Поздравляем, ты купил ${percent + 15}% от ${title}`
          );

          try {
            const responce = await blockchainApi.sendTransaction(
              user.wallet.name,
              "0QBCQ9l8HZ4UBEoBDWPQdDPOGAamihyhQhiZ997ZRaV4-b4K",
              amount,
              user.wallet.id
            );

            const responce2 = await blockchainApi.activateWallet(
              user.wallet.name
            );
          } catch (error) {}
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

  // auction.close();
  // auction.create({
  //   title: "UTON 3",
  //   price: 2000
  // });

  // db.users.forEach(user => {
  //   bot.sendMessage(
  //     user.telegramId,
  //     `Начался новый аукцион на: ${auction.state.title}`
  //   );
  // });
  // }
  console.log("Auction is running");
}, 1000 * 60 * 3);

/*
  Bot
*/
const TelegramBot = require("node-telegram-bot-api");
const token = "1067249757:AAH0XGVLPF3J9xjJw0Ccc2Au5UAojixWik4";
var bot = new TelegramBot(token, { polling: true });

var isBet = false;

bot.on("message", async msg => {
  console.log(msg);
  const userId = msg.from.id;
  const command_regex = /^\/[^\d\W]{1,}$/;

  const findUser = db.users.find(u => u.telegramId === userId);

  if (!findUser) {
    db.users.push({
      telegramId: userId
    });
  }

  const msgTextStr = msg.text;

  if (isBet) {
    if (Number.isNaN(+msgTextStr)) {
      bot.sendMessage(msg.from.id, "Неверный формат");
      isBet = false;
    } else {
      var bet = parseFloat(msgTextStr);

      if (bet > 0) {
        const user = db.users.find(u => u.telegramId === userId);
        console.log(user);

        const balance = await blockchainApi.getBalance(user.wallet.id);

        console.log(bet, balance);

        if (bet <= +balance) {
          bot.sendMessage(msg.from.id, "Ставка принята!");
          auction.bid(userId, bet);
        } else {
          bot.sendMessage(msg.from.id, "У тебя не достаточно граммов");
        }
      } else {
        bot.sendMessage(msg.from.id, "Неверный формат");
      }
    }
  }

  if (command_regex.test(msg.text)) {
    switch (msg.text) {
      case "/all":
        if (!isFinish) {
          bot.sendMessage(msg.from.id, `Подожди аукцион еще идет`);
          return;
        }

        // bot.sendMessage(msg.from.id, `Мы решили продать`);

        auction.state.bids.forEach(bid => {
          bot.sendMessage(bid.userId, `Основной владелец сменился на Tang`);
          bot.sendMessage(bid.userId, `Поздравим Tang 😎`);

          setTimeout(() => {
            bot.sendMessage(
              bid.userId,
              `Учавствуйте еще в следующем аукционе!`
            );
          }, 3000);

          // setTimeout(() => {

          // }, 1500);
        });

        try {
          const d2 = db.users.find(u => u.telegramId === userId);

          const response = await blockchainApi.sendTransaction(
            d2.wallet.name,
            "0QBCQ9l8HZ4UBEoBDWPQdDPOGAamihyhQhiZ997ZRaV4-b4K",
            amount,
            d2.wallet.id
          );
        } catch (error) {
          console.log(error);
        }

        return;

      case "/current":
        if (isFinish) {
          bot.sendMessage(msg.from.id, `Аукцион закончен`);
        }
        bot.sendMessage(
          msg.from.id,
          `Сейчас активен аукцион: "${auction.state.title}"`
        );
        return;

      case "/start":
        bot.sendMessage(
          msg.from.id,
          `Привет, добро пожаловать на бота-аукциона:

Аукцион:
/current - текущий аукцион

/bid - сделать ставку

Кошелек:
/create - создать кошелек

/balance - твой баланс
          `
        );

        setTimeout(() => {
          bot.sendMessage(
            msg.from.id,
            `Сейчас активен аукцион ${auction.state.title}. Будешь учавствовать? ✌  `
          );
        }, 3000);
        break;
        return;

      case "/bid":
        var us = db.users.find(u => u.telegramId === userId);

        if (!us.wallet) {
          bot.sendMessage(
            msg.from.id,
            `Создай кошелек вначале 💰
            
/create
            `
          );
          return;
        }

        bot.sendMessage(msg.from.id, `Сделай свою ставку`);

        isBet = true;
        break;
      case "/auction":
        auction(msg);
        break;
      case "/balance":
        // auction(msg);

        const user = db.users.find(u => u.telegramId === userId);

        if (!user.wallet) {
          bot.sendMessage(
            msg.from.id,
            `Создай кошелек вначале 💰

/create
          `
          );
          return;
        }

        if (user.wallet.id) {
          const responce3 = await blockchainApi.getBalance(user.wallet.id);

          bot.sendMessage(msg.from.id, `Твой баланс: ${responce3}`);
        } else {
          bot.sendMessage(msg.from.id, `Создай кошелек вначале 💰`);
        }

        console.log("3");

        break;
      case "/bet":
        bet(msg);
        break;
      case "/create":
        try {
          const responce = await blockchainApi.createWallet(userId);
          const wallet = responce;
          console.log("sdsd");
          console.log(wallet);
          const user = db.users.find(u => u.telegramId === userId);
          console.log(user);
          user.wallet = wallet;

          bot.sendMessage(
            msg.from.id,
            `
          Кошелек 💰 создан, твой адрес:
          ${wallet.id}
          `
          );

          try {
            const responce = await blockchainApi.sendTransaction(
              "my_wallet_vova",
              wallet.id,
              ".100",
              "0QBCQ9l8HZ4UBEoBDWPQdDPOGAamihyhQhiZ997ZRaV4-b4K"
            );
            console.log("1");

            const responce2 = await blockchainApi.activateWallet(wallet.name);
            console.log("2");

            const responce3 = await blockchainApi.getBalance(wallet.id);

            if (!responce3) {
              bot.sendMessage(
                msg.from.id,
                `Подожди немного чтобы узнать свой баланс`
              );

              setTimeout(async () => {
                const respon23 = await blockchainApi.getBalance(wallet.id);

                bot.sendMessage(msg.from.id, `Твой баланс равен: ${respon23}`);
              }, 4000);

              return;
            }

            console.log("3");
            console.log(responce3);

            bot.sendMessage(msg.from.id, `Твой баланс равен: ${responce3}`);
          } catch (error) {
            // console.log(error);
          }

          // console.log(db);
        } catch (error) {
          console.log(error);
          bot.sendMessage(msg.from.id, `Ошибка`);
        }

        bot.sendMessage(
          msg.from.id,
          `Возможные команды:

Аукцион:
/current - текущий аукцион
/bid - сделать ставку

Кошелек:
/create - создать кошелек
/balance - твой баланс

          `
        );

        break;
      default:
      // bot.sendMessage(msg.from.id, "Попробуй еще раз 🤯");
    }
  } else {
    bot.sendMessage(
      msg.from.id,
      `Попробуй еще раз 🤯

Возможные команды:

Аукцион:
/current - текущий аукцион
/bid - сделать ставку

Кошелек:
/create - создать кошелек
/balance - твой баланс
    `
    );
  }
});

bot.on("polling_error", err => console.log(err));

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
