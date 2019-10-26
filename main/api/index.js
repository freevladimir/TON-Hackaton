const axios = require("axios");

const BLOCKCHAIN_API = "localhost:3000";

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

export { createWallet, getBalance, sendTransaction };
