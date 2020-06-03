import React from "react";
import Contract from "../contract";
import { Card, Table } from "react-bootstrap";
import Config from "../config.json";
import Web3 from "web3";
import FlightSuretyData from "../../../build/contracts/FlightSuretyData.json";

const styles = {
  card: {
    marginTop: "1rem",
    padding: "0.5rem",
    color: "black"
  }
};
const List = () => {
  const renderAirlines = () => {
    const airlines = Contract.fetchAirlines((error, result) => {
      console.log("VOy");
      if (error) {
        console.log("Errorl: ", error);
      } else {
        console.log("Result: ", result);
      }
    });
    // const counter = Contract.getAirlinesCounter((error, result) => {
    //   if (error) {
    //     console.log("Error: ", error);
    //   } else {
    //     console.log("Counter: ", result);
    //   }
    // });
    // const status = Contract.fetchAirlineStatus(airline, (error, result) => {
    //   if (error) {
    //     console.log("ERROR: ", error);
    //   } else {
    //     console.log("RESULTADO: ", result);
    //   }
    // });

    console.log("STATUS: ", status);
    return (
      <tr key="eoe">
        <td>lala</td>
        <td>Ok</td>
        <td>Ok</td>
      </tr>
    );
  };

  return (
    <Card style={styles.card}>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Airlines Addresses</th>
            <th>Registered</th>
            <th>Funded</th>
          </tr>
        </thead>
        <tbody>{renderAirlines()}</tbody>
      </Table>
    </Card>
  );
};

export default List;
