const axios = require("axios");

// const BLOCKCHAIN_API = "localhost:3000";
const BLOCKCHAIN_API = "http://b4659955.ngrok.io";

async function createWallet(telId) {
  try {
    const response = await axios.post(`${BLOCKCHAIN_API}/api/create-wallet`, {
      telegram_id: telId
    });

    const { id, wallet_name } = response.data;
    console.log(id, wallet_name);

    return {
      id,

      name: wallet_name
    };
  } catch (error) {
    console.log(error.response.data);
    // throw error;
  }
}

async function getBalance(wallet) {
  try {
    const response = await axios.get(
      `${BLOCKCHAIN_API}/api/get-balance?address=${wallet}`
    );
    const { balance } = response.data;
    console.log(response.data);

    if (balance.includes("not found")) {
      return 150;
    } else {
      return Math.floor(balance / 1000000);
    }
  } catch (error) {
    console.log(error.response.data);
    throw error;
  }
}

// getBalance("0f8Pl9aMUQtpcaohL1Bd5ixj4-ma60oCCJAezHOmTBwLfNsa");

async function sendTransaction(sender, recipient, amount, spenderId) {
  console.log(sender, recipient, amount, spenderId);
  try {
    const response = await axios.post(`${BLOCKCHAIN_API}/api/transaction`, {
      // sender: "my_wallet_vova",
      // recipient: "0QAH_BQZq6jK9683SxhsKU0GOrV7So5I4HHdEyHfGwWTvPTu",
      // amount: ".200"
      sender,
      recipient,
      amount,
      spenderId
    });

    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function activateWallet(name) {
  try {
    const response = await axios.post(`${BLOCKCHAIN_API}/api/activate-wallet`, {
      wallet_name: name
    });

    console.log(response.data);

    return true;
  } catch (error) {
    console.log(error.data.response);
    throw error;
  }
}

module.exports = { createWallet, getBalance, sendTransaction, activateWallet };
