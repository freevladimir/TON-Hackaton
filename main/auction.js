class Auction {
  constructor() {
    this.state = {
      // created: Date
      // title: 'Picture'
      // id: 5,
      users: [],
      // price:
      bids: [
        {
          userId: "123",
          amount: 200
        }
      ]
      // calculating:
    };
  }

  create(params) {
    this.state = {
      ...params,
      bids: [],
      created: Date.parse(new Date())
    };
  }

  isExprired() {
    const AUCTION_LIFETIME = 1 * 1000 * 1000; // 1 min

    if (Date.parse(new Date()) > this.state.created + AUCTION_LIFETIME) {
      return true;
    }

    return false;
  }

  bid(userId, amount) {
    console.log("Bid ", userId, ", user", amount);

    const find = this.state.bids.find(bid => bid.userId === userId);

    if (find) {
      console.log("Твоя ставка изменена");
      find.amount = amount;
      return;
    }
    this.state.bids.push({
      userId,
      amount
    });
  }

  close() {
    this.state = {
      bids: []
    };
  }
}

module.exports = Auction;
