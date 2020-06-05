import React, { useState } from "react";
import Contract from "../contract";
import { Alert, Button, Col, Dropdown, Form } from "react-bootstrap";

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

const Add = () => {
  const [alert, setAlertValue] = useState({
    show: false,
    variant: "",
    message: ""
  });
  const [addressValue, setAddressValue] = useState("");
  const [nameValue, setNameValue] = useState("");

  const handleError = error => {
    // let message = "Error: Unknown error";
    // if (error.message.includes("Airline is registered")) {
    //   message = "Error: Airline is registered ";
    // } else if (
    //   error.message.includes("First Four require caller is Airline registered")
    // ) {
    //   message =
    //     "Error: First Four airlines require to be registered for existing airline";
    // } else if (error.message.includes("Caller is not valid")) {
    //   message = "Error: Caller is not valid";
    // } else {
    //   console.log("Error adding airline: ", error.message);
    // }
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

    Contract.registerAirline(addressValue, nameValue, (error, result) => {
      if (error) {
        handleError(error);
      } else {
        handleSucces("Airline was added to registration queue with success");
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
    <div style={styles.body}>
      <Form>
        <Form.Group controlId="formGridAddress2">
          <Form.Label>Name</Form.Label>
          <Form.Control
            placeholder="Airline Name"
            value={nameValue}
            onChange={e => handleNameValue(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formGridAddress1">
          <Form.Label>Address</Form.Label>
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
                <Dropdown.Toggle id="dropdown-basic">Addresses</Dropdown.Toggle>
                <Dropdown.Menu>{getAddresses()}</Dropdown.Menu>
              </Dropdown>
            </Col>
          </Form.Row>
        </Form.Group>

        <Button
          id="addAirline"
          variant="outline-primary"
          type="submit"
          onClick={submit}
        >
          Add Airline
        </Button>
        <Button
          id="resetAddAirline"
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
    </div>
  );
};

export default Add;
