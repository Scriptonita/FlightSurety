import React from "react";
import Contract from "../contract";
import { Card, Table } from "react-bootstrap";

const styles = {
  card: {
    marginTop: "1rem",
    padding: "0.5rem",
    color: "black"
  }
};
const List = () => {
  // Contract.isAuthorized((error, result) => {
  //   if (error) {
  //     console.log("Otro errror: ", error);
  //   } else {
  //     console.log("Resultado Autorized: ", result);
  //   }
  // });
  const renderAirline = airline => {
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
    // console.log("STATUS: ", status);
    return (
      <tr key={airline}>
        <td>{airline}</td>
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
        <tbody>
          {Contract.airlines.map(airline => renderAirline(airline))}
        </tbody>
      </Table>
    </Card>
  );
};

export default List;
