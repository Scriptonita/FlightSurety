import FlightSuretyApp from "../../build/contracts/FlightSuretyApp.json";
import FlightSuretyData from "../../build/contracts/FlightSuretyData.json";
import Config from "./config.json";
import Web3 from "web3";

class ContractClass {
  constructor(network, callback) {
    let config = Config[network];
    this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
    this.flightSuretyApp = new this.web3.eth.Contract(
      FlightSuretyApp.abi,
      config.appAddress
    );
    this.initialize(callback);
    this.owner = null;
    this.airlines = [];
    this.passengers = [];
    this.accounts = [];
  }

  initialize(callback) {
    this.web3.eth.getAccounts((error, accts) => {
      this.owner = accts[0];
      this.accounts = accts;

      let counter = 1;

      while (this.airlines.length < 5) {
        this.airlines.push(accts[counter++]);
      }

      while (this.passengers.length < 5) {
        this.passengers.push(accts[counter++]);
      }

      callback();
    });
  }

  isAuthorized(callback) {
    let self = this;
    self.flightSuretyApp.methods
      .isAuthorized(self.owner)
      .call({ from: self.owner }, callback);
  }

  isOperational(callback) {
    let self = this;
    self.flightSuretyApp.methods
      .isOperational()
      .call({ from: self.owner }, callback);
  }

  fetchFlightStatus(flight, callback) {
    let self = this;
    let payload = {
      airline: self.airlines[0],
      flight: flight,
      timestamp: Math.floor(Date.now() / 1000)
    };
    self.flightSuretyApp.methods
      .fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)
      .send({ from: self.owner }, (error, result) => {
        callback(error, payload);
      });
  }

  registerAirline(address, name, callback) {
    let self = this;
    self.flightSuretyApp.methods
      .registerAirline(address, name)
      .send({ from: self.owner }, callback);
  }

  fetchAirlines() {
    let self = this;
  }

  getContractOwner() {
    let self = this;
    self.flightSuretyApp.methods
      .getContractOwner()
      .call({ from: self.owner }, (error, result) => {
        if (error) {
          console.log("Error: ", error);
        } else {
          console.log("Contract Owner deployed: ", result);
        }
      });
  }

  getAirlineStatus(address, callback) {
    let self = this;
    console.log("OWNER: ", self.owner);
    self.flightSuretyApp.methods
      .getAirlineStatus(address)
      .call({ from: self.owner }, callback);
  }

  getAirlinesCounter(callback) {
    let self = this;
    self.flightSuretyApp.methods
      .getAirlinesCounter()
      .call({ from: self.owner }, callback);
  }
}

const Contract = new ContractClass("localhost", () => {
  const event = new CustomEvent("contractInitialized");

  window.dispatchEvent(event);
  console.log("Contract initialized");
});

export default Contract;
