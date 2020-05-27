import React, { useState, useRef } from "react";
import Contract from "../contract";
import { Button, FormControl, InputGroup, Table } from "react-bootstrap";

const styles = {
  body: {
    color: "black",
    padding: "0.5rem"
  }
};

const Flights = () => {
  const flight = useRef();
  const [flightData, setFlightData] = useState(null);

  const submit = () => {
    const flightToSearch = flight.current.value;

    const contract = new Contract("localhost", () => {
      contract.fetchFlightStatus(flightToSearch, (error, result) => {
        setFlightData(result);
      });
    });
  };

  const renderFlightData = () => (
    <Table striped bordered>
      <tbody>
        <tr>
          <th>Flight Id</th>
          <td>{flightData.flight}</td>
        </tr>
        <tr>
          <th>Airline</th>
          <td>{flightData.airline}</td>
        </tr>
        <tr>
          <th>Timestamp</th>
          <td>{flightData.timestamp}</td>
        </tr>
      </tbody>
    </Table>
  );

  return (
    <div style={styles.body}>
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text id="flight-search">Flight</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          placeholder="Search..."
          aria-label="Username"
          aria-describedby="flight-search"
          ref={flight}
        />
        <InputGroup.Append>
          <Button variant="outline-primary" onClick={submit}>
            Submit to Oracles
          </Button>
        </InputGroup.Append>
      </InputGroup>
      {flightData && renderFlightData()}
    </div>
  );
};

export default Flights;
