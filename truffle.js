var HDWalletProvider = require("@truffle/hdwallet-provider");
const fs = require("fs");

var mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  networks: {
    development: {
      provider: function () {
        return new HDWalletProvider(mnemonic, "http://127.0.0.1:8545/", 0, 50);
      },
      network_id: "*",
      gas: 9999999
    }
  },
  compilers: {
    solc: {
      version: "0.6.8"
    }
  },
  optimizer: { enabled: true, runs: 200 }
};
