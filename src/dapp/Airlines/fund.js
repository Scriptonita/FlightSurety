import React, { useState, useRef } from "react";
import Contract from "../contract";
import { Button, Card } from "react-bootstrap";

const styles = {
  card: {
    marginTop: "1rem",
    padding: "1rem",
    color: "black"
  }
};
const Fund = ({ toFund, onSuccess }) => {
  const fundInput = useRef();

  const transferFunds = e => {
    e.preventDefault();
    Contract.fundAirline(toFund, 10, (error, result) => {
      if (error) {
        console.log("Error: ", error);
      } else {
        onSuccess(e);
      }
    });
  };

  return (
    <Card style={styles.card}>
      <Button
        id="fundAirline"
        variant="outline-primary"
        type="submit"
        onClick={transferFunds}
      >
        Send 10 Ethers to Fund
      </Button>
    </Card>
  );
};

export default Fund;
