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

module.exports = Auction;
