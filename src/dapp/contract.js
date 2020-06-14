import FlightSuretyApp from "../../build/contracts/FlightSuretyApp.json";
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
    this.flights = [];
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

      this.flights = [
        {
          name: "FF001",
          airline: this.owner
        },
        {
          name: "ML999",
          airline: this.owner
        },
        {
          name: "SV314",
          airline: this.owner
        },
        {
          name: "JH137",
          airline: this.owner
        }
      ];

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

  // Airlines

  registerAirline(address, name, callback) {
    let self = this;
    self.flightSuretyApp.methods
      .registerAirline(address, name)
      .send({ from: self.owner, gas: 9999999 }, callback);
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

  voteAirline(voter, voted, callback) {
    let self = this;
    self.flightSuretyApp.methods
      .voteAirline(voted)
      .send({ from: voter, gas: 9999999 }, callback);
  }

  fundAirline(address, value, callback) {
    let self = this;
    self.flightSuretyApp.methods
      .fundAirline()
      .send({ from: address, value: value * 1000000000000000000 }, callback);
  }

  // Flights

  addFlight(airline, name, callback) {
    let self = this;
    self.flightSuretyApp.methods
      .isFundedAirline(airline)
      .call({ from: self.owner }, (error, result) => {
        if (result) this.flights.push({ name, airline });
        callback(error, result);
      });
  }

  getFlights() {
    return this.flights;
  }

  registerFlight(airline, name, callback) {
    let self = this;
    self.flightSuretyApp.methods
      .registerFlight(airline, name)
      .send({ from: airline, gas: 9999999 }, callback);
  }

  fetchFlightStatus(airline, flight, callback) {
    let self = this;
    const timestamp = Math.floor(Date.now() / 1000);
    self.flightSuretyApp.methods
      .fetchFlightStatus(airline, flight, timestamp)
      .send({ from: self.owner }, callback);
  }

  getStatusOfFlight(flight, callback) {
    let self = this;
    self.flightSuretyApp.methods
      .getStatusOfFlight(flight)
      .call({ from: self.owner }, callback);
  }

  buyInsurance(passenger, airline, flight, value, callback) {
    let self = this;
    self.flightSuretyApp.methods
      .buy(airline, flight)
      .send(
        { from: passenger, value: value * 1000000000000000000, gas: 9999999 },
        callback
      );
  }

  getInsurance(passenger, airline, flight, callback) {
    let self = this;
    self.flightSuretyApp.methods
      .getInsurance(passenger, airline, flight)
      .call({ from: self.owner }, callback);
  }

  getPassenger(passenger, callback) {
    let self = this;
    self.flightSuretyApp.methods
      .getPassenger(passenger)
      .call({ from: self.owner }, callback);
  }

  creditInsurees(passenger, airline, flight, callback) {
    let self = this;
    self.flightSuretyApp.methods
      .creditInsurees(passenger, airline, flight)
      .send({ from: self.owner, gas: 9999999 }, callback);
  }

  pay(passenger, value, callback) {
    let self = this;
    self.flightSuretyApp.methods
      .pay(passenger)
      .send(
        { from: self.owner, value: value * 1000000000000000000, gas: 9999999 },
        callback
      );
  }
}

const Contract = new ContractClass("localhost", () => {
  const event = new CustomEvent("contractInitialized");

  window.dispatchEvent(event);
  console.log("Contract initialized");
});

export default Contract;
