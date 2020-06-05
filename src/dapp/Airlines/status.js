import React, { useState } from "react";
import Contract from "../contract";
import {
  Alert,
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Table
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";
import Vote from "./vote";

const styles = {
  alert: {
    marginTop: "1rem"
  },
  card: {
    marginTop: "1rem",
    padding: "0.5rem",
    color: "black"
  },
  table: {
    marginTop: "1rem"
  },
  reset: {
    marginLeft: "1rem"
  }
};
const Status = () => {
  const [addressValue, setAddressValue] = useState("");
  const [status, setStatus] = useState({
    show: false,
    name: "",
    isRegistered: false,
    isFunded: false,
    votes: 0
  });
  const [alert, setAlertValue] = useState({
    show: false,
    message: ""
  });

  const handleAddressValue = newValue => setAddressValue(newValue);

  const handleError = (error, string) => {
    let message = "Error: Unknown error";
    if (string && error.message.includes(string)) {
      message = "Error: " + string;
    }
    setAlertValue({ show: true, message });
  };

  const submit = e => {
    e.preventDefault();
    setStatus({ show: false });
    setAlertValue({ show: false });
    Contract.getAirlineStatus(addressValue, (error, result) => {
      if (error) {
        handleError(error, "Airline is not registered");
      } else {
        setStatus({
          show: true,
          name: result[0],
          isRegistered: result[1],
          isFunded: result[2],
          votes: result[3]
        });
      }
    });
  };

  const reset = e => {
    e.preventDefault();
    setStatus({
      show: false,
      name: "",
      isRegistered: false,
      isFunded: false,
      votes: 0
    });
    setAddressValue("");
    setAlertValue({ show: false, message: "" });
  };

  const getAddresses = () =>
    Contract.accounts.map(acc => (
      <Dropdown.Item key={acc} onClick={() => handleAddressValue(acc)}>
        {acc}
      </Dropdown.Item>
    ));

  const closeAlert = () => {
    setAlertValue({ show: false, variant: "", message: "" });
  };

  const renderAirlineStatus = () => (
    <tr>
      <td>{status.name}</td>
      <td>
        {status.isRegistered ? (
          <FontAwesomeIcon icon={faCheckCircle} color="green" />
        ) : (
          <FontAwesomeIcon icon={faTimesCircle} color="red" />
        )}
      </td>
      <td>
        {status.isFunded ? (
          <FontAwesomeIcon icon={faCheckCircle} color="green" />
        ) : (
          <FontAwesomeIcon icon={faTimesCircle} color="red" />
        )}
      </td>
      <td>{status.votes}</td>
    </tr>
  );

  return (
    <Card style={styles.card}>
      <Form>
        <Form.Group controlId="formAirlineStatus">
          <Form.Label>Search by Address</Form.Label>
          <Form.Row>
            <Col sm={9}>
              <Form.Control
                placeholder="Airline Address"
                value={addressValue}
                onChange={e => handleAddressValue(e.target.value)}
              />
            </Col>
            <Col sm={3}>
              <Dropdown>
                <Dropdown.Toggle id="dropdownAirlineStatus">
                  Addresses
                </Dropdown.Toggle>
                <Dropdown.Menu>{getAddresses()}</Dropdown.Menu>
              </Dropdown>
            </Col>
          </Form.Row>
        </Form.Group>

        <Button
          id="getStatus"
          variant="outline-primary"
          type="submit"
          onClick={submit}
        >
          Get Status
        </Button>
        <Button
          id="resetStatus"
          variant="outline-primary"
          type="submit"
          onClick={reset}
          style={styles.reset}
        >
          Reset
        </Button>
      </Form>
      {status.show && (
        <div>
          <Table style={styles.table} striped bordered>
            <thead>
              <tr>
                <th>Airline Name</th>
                <th>Registered</th>
                <th>Funded</th>
                <th>Votes</th>
              </tr>
            </thead>
            <tbody>{renderAirlineStatus()}</tbody>
          </Table>
          <div>
            {!status.isRegistered && (
              <Vote toVote={addressValue} onSuccess={submit} />
            )}
            {!status.isFunded && <div>Fund</div>}
          </div>
        </div>
      )}
      {alert.show && (
        <Alert
          style={styles.alert}
          variant="danger"
          onClose={closeAlert}
          dismissible
        >
          {alert.message}
        </Alert>
      )}
    </Card>
  );
};

export default Status;
