import React, { useState, useRef } from "react";
import Contract from "../contract";
import { Alert, Button, FormControl, InputGroup, Table } from "react-bootstrap";
import Reclamation from "./reclamation";

const styles = {
  body: {
    color: "black",
    padding: "0.5rem"
  },
  loading: {
    color: "blue"
  }
};

const statusCodes = {
  0: "Flight state is unknown",
  10: "Flight is on time",
  20: "Flight is late",
  30: "Flight is late due to weather",
  40: "Flight is late due to technical reasons",
  50: "Flight is late due to undefined reasons"
};

const Status = () => {
  const flight = useRef();
  const [flightData, setFlightData] = useState(null);
  const [status, setStatus] = useState(0);
  const [alert, setAlertValue] = useState({
    show: false,
    variant: "",
    message: ""
  });
  const [reclamation, setReclamation] = useState(false);

  const handleError = error => {
    setAlertValue({ show: true, variant: "danger", message: error.message });
  };

  const closeAlert = () => {
    setAlertValue({ show: false, variant: "", message: "" });
  };

  const submit = e => {
    e.preventDefault();
    setFlightData(null);
    setStatus(0);
    setReclamation(false);
    closeAlert();
    const flightToSearch = flight.current.value;
    const flights = Contract.getFlights();

    let names = [];
    for (let x = 0; x < flights.length; x++) {
      names.push(flights[x].name);
    }

    let found = null;

    Object.keys(flights).forEach(flight => {
      if (flights[flight].name === flightToSearch) {
        found = flights[flight];
        Contract.fetchFlightStatus(
          found.airline,
          found.name,
          (error, result) => {
            if (error) {
              handleError(error);
            }
            if (result) {
              setFlightData(found);
            }
          }
        );
      }
    });

    if (!found) {
      const err = new Error();
      err.message =
        "Sorry, Flight does not exists. Be careful with capital letters";
      handleError(err);
    }
  };

  const getStatus = e => {
    e.preventDefault();
    Contract.getStatusOfFlight(flightData.name, (error, result) => {
      if (error) {
        setStatus(0);
      } else {
        console.log("RESULT STATUS: ", result);
        const status = result[1];
        setFlightData({
          name: flightData.name,
          airline: flightData.airline,
          timestamp: result[0],
          status: status
        });

        if (
          status === "20" ||
          status === "30" ||
          status === "40" ||
          status === "50"
        ) {
          setReclamation(true);
        }
      }
    });
  };

  const parseStatus = () => {};

  const renderFlightData = () => (
    <Table striped bordered>
      <tbody>
        <tr>
          <th>Flight Id</th>
          <td>{flightData.name}</td>
        </tr>
        <tr>
          <th>Airline</th>
          <td>{flightData.airline}</td>
        </tr>
        <tr>
          <th>Timestamp</th>
          <td>{flightData.timestamp ? flightData.timestamp : "unknown"}</td>
        </tr>
        <tr>
          <th>Status</th>
          <td>
            {flightData.status ? (
              `${flightData.status} - ${statusCodes[flightData.status]}`
            ) : (
              <Button
                id="addAirline"
                variant="outline-primary"
                type="submit"
                onClick={getStatus}
              >
                Get Status
              </Button>
            )}
          </td>
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
      {alert.show && (
        <Alert
          style={styles.alert}
          variant={alert.variant}
          onClose={closeAlert}
          dismissible
        >
          {alert.message}
        </Alert>
      )}
      {reclamation && (
        <Reclamation airline={flightData.airline} flight={flightData.name} />
      )}
    </div>
  );
};

export default Status;
