import React, { useState } from "react";
import Contract from "../contract";
import { Alert, Button, Card, Col, Dropdown, Form } from "react-bootstrap";

const styles = {
  alert: {
    marginTop: "1rem"
  },
  body: {
    color: "black",
    padding: "0.5rem"
  },
  reset: {
    marginLeft: "1rem"
  }
};

const Add = ({ update }) => {
  const [alert, setAlertValue] = useState({
    show: false,
    variant: "",
    message: ""
  });
  const [addressValue, setAddressValue] = useState("");
  const [nameValue, setNameValue] = useState("");

  const handleError = error => {
    setAlertValue({ show: true, variant: "danger", message: error.message });
  };

  const handleSucces = message => {
    setAlertValue({ show: true, variant: "success", message });
  };

  const closeAlert = () => {
    setAlertValue({ show: false, variant: "", message: "" });
  };

  const submit = e => {
    e.preventDefault();
    Contract.addFlight(addressValue, nameValue, (error, result) => {
      if (error) handleError("Error");
      else if (result) {
        handleSucces("Flight was added with success");
        update();
      } else {
        const err = new Error();
        err.message = "Error: probably airline is not funded";
        handleError(err);
      }
    });
  };

  const reset = e => {
    e.preventDefault();
    setAlertValue({ show: false, variant: "", message: "" });
    setAddressValue("");
    setNameValue("");
  };

  const handleAddressValue = newValue => setAddressValue(newValue);

  const handleNameValue = newValue => setNameValue(newValue);

  const getAddresses = () =>
    Contract.accounts.map(acc => (
      <Dropdown.Item key={acc} onClick={() => handleAddressValue(acc)}>
        {acc}
      </Dropdown.Item>
    ));

  return (
    <Card style={styles.body}>
      <Form>
        <Form.Group controlId="formGridFlightName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            placeholder="Flight Name"
            value={nameValue}
            onChange={e => handleNameValue(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formGridFlightAddress">
          <Form.Label>Airline</Form.Label>
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
                <Dropdown.Toggle id="dropdown-airlines-basic">
                  Addresses
                </Dropdown.Toggle>
                <Dropdown.Menu>{getAddresses()}</Dropdown.Menu>
              </Dropdown>
            </Col>
          </Form.Row>
        </Form.Group>

        <Button
          id="addFlight"
          variant="outline-primary"
          type="submit"
          onClick={submit}
        >
          Add Flight
        </Button>
        <Button
          id="resetAddFlight"
          variant="outline-primary"
          type="submit"
          onClick={reset}
          style={styles.reset}
        >
          Reset
        </Button>
      </Form>
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
    </Card>
  );
};

export default Add;
