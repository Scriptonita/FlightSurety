import React, { useState, useRef } from "react";
import Contract from "../contract";
import { Button, Form, FormControl, InputGroup, Table } from "react-bootstrap";

const styles = {
  body: {
    color: "black",
    padding: "0.5rem"
  }
};

const Add = () => {
  const address = useRef("");
  const name = useRef("");

  const submit = () => {
    const airlineAddress = address.current.value;
    const airlineName = name.current.value;

    console.log("AirlineAddress: ", airlineAddress);
    console.log("AirlineName: ", airlineName);
    console.log("Airlines: ", Contract.airlines);
    console.log("Passengers: ", Contract.passengers);
  };

  return (
    <div style={styles.body}>
      <Form>
        <Form.Group controlId="formGridAddress2">
          <Form.Label>Name</Form.Label>
          <Form.Control placeholder="Airline Name" ref={name} />
        </Form.Group>

        <Form.Group controlId="formGridAddress1">
          <Form.Label>Address</Form.Label>
          <Form.Control placeholder="Airline Address" ref={address} />
        </Form.Group>

        <Button variant="outline-primary" type="submit" onClick={submit}>
          Add Aeroline
        </Button>
      </Form>
    </div>
  );
};

export default Add;
