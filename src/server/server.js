import FlightSuretyApp from "../../build/contracts/FlightSuretyApp.json";
import FlightSuretyData from "../../build/contracts/FlightSuretyData.json";
import Config from "./config.json";
import Web3 from "web3";
import express from "express";

let oracles = {};
const ORACLES_COUNT = 15;
const STATUS_CODE_UNKNOWN = 0;
const STATUS_CODE_ON_TIME = 10;
const STATUS_CODE_LATE_AIRLINE = 20;
const STATUS_CODE_LATE_WEATHER = 30;
const STATUS_CODE_LATE_TECHNICAL = 40;
const STATUS_CODE_LATE_OTHER = 50;
const STATUSCODES = [
  STATUS_CODE_UNKNOWN,
  STATUS_CODE_ON_TIME,
  STATUS_CODE_LATE_AIRLINE,
  STATUS_CODE_LATE_WEATHER,
  STATUS_CODE_LATE_TECHNICAL,
  STATUS_CODE_LATE_OTHER
];

let config = Config["localhost"];
let web3 = new Web3(
  new Web3.providers.WebsocketProvider(config.url.replace("http", "ws"))
);
web3.eth.defaultAccount = web3.eth.accounts[0];
let flightSuretyApp = new web3.eth.Contract(
  FlightSuretyApp.abi,
  config.appAddress
);
let flightSuretyData = new web3.eth.Contract(
  FlightSuretyData.abi,
  config.dataAddress
);

web3.eth.getAccounts((error, accts) => {
  const owner = accts[0];
  flightSuretyData.methods
    .authorizeCaller(config.appAddress)
    .send({ from: owner }, (error, authorized) => {
      if (error) {
        return console.log("Error 1:", error.message);
      }
      console.log("Owner address is Authorized: ", authorized);
      flightSuretyApp.methods
        .getRegistrationFee()
        .call({ from: owner }, (error, registrationFee) => {
          if (error) {
            return console.log("Error 2: ", error.message);
          }
          // start with 1 due that we are using 0 as owner
          for (let index = 1; index < ORACLES_COUNT; index++) {
            flightSuretyApp.methods
              .registerOracle()
              .send(
                { from: accts[index], value: registrationFee, gas: 9999999 },
                (error, result) => {
                  if (error) {
                    return console.log("Error 3: ", error.message);
                  }
                  flightSuretyApp.methods
                    .getMyIndexes()
                    .call({ from: accts[index] }, (error, indexes) => {
                      if (error) {
                        return console.log("Error 4: ", error.message);
                      }
                      oracles[accts[index]] = indexes;
                    });
                }
              );
          }
        });
    });
});

flightSuretyApp.events.OracleRequest(
  {
    fromBlock: 0
  },
  function (error, event) {
    if (error) console.log(error);
    const { index, airline, flight, timestamp } = event.returnValues;
    const statusCode =
      STATUSCODES[Math.floor(Math.random() * STATUSCODES.length)];
    Object.keys(oracles).forEach(oracle => {
      if (oracles[oracle].includes(index)) {
        flightSuretyApp.methods
          .submitOracleResponse(index, airline, flight, timestamp, statusCode)
          .send({ from: oracle, gas: 9999999 }, (error, result) => {
            if (error) {
              console.log("Error submiting Oracle response: ", error.message);
            } else {
              console.log(
                `Oracle ${oracle} submited response with status code ${statusCode}`
              );
            }
          });
      }
    });
  }
);

const app = express();
app.get("/api", (req, res) => {
  res.send({
    message: "An API for use with your Dapp!"
  });
});

export default app;
