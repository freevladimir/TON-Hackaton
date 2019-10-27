const axios = require("axios");

// const BLOCKCHAIN_API = "localhost:3000";
const BLOCKCHAIN_API = "http://11cb26c4.ngrok.io";

async function createWallet() {
  try {
    const response = await axios.post(`${BLOCKCHAIN_API}/api/create-wallet`);
    const { id, name } = response.data;

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
      // sender: "my_wallet_vova",
      // recipient: "0QAH_BQZq6jK9683SxhsKU0GOrV7So5I4HHdEyHfGwWTvPTu",
      // amount: ".010"
    });

    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = { createWallet, getBalance, sendTransaction };
