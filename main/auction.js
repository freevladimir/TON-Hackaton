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
    this.state = {
      ...params,
      users: [],
      created: Date.parse(new Date())
    };
  }

  isExprired() {
    const AUCTION_LIFETIME = 10 * 60 * 1000; // 10 mins

    if (Date.parse(new Date()) > this.state.created + AUCTION_LIFETIME) {
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
