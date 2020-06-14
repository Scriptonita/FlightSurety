import React, { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Table
} from "react-bootstrap";
import Contract from "../contract";

const styles = {
  body: {
    color: "black",
    padding: "0.5rem"
  },
  table: {
    marginTop: "1rem"
  }
};

const List = ({ flights, update }) => {
  const [addressValue, setAddressValue] = useState("");
  const [value, setValue] = useState(1);
  const [alert, setAlertValue] = useState({
    show: false,
    variant: "",
    message: ""
  });

  const handleError = error => {
    setAlertValue({ show: true, variant: "danger", message: error.message });
  };

  const handleSuccess = message => {
    setAlertValue({ show: true, variant: "success", message });
  };

  const closeAlert = () => {
    setAlertValue({ show: false, variant: "", message: "" });
  };

  const buy = (e, flight) => {
    e.preventDefault();
    const { name, airline } = flight;
    Contract.buyInsurance(
      addressValue,
      airline,
      name,
      value,
      (error, result) => {
        if (error) {
          handleError(error);
        } else if (result) {
          handleSuccess("Insurance was bought");
        } else {
          const err = new Error();
          err.message = "Unknown error";
          handleError(err);
        }
      }
    );
  };
  const renderFlights = () =>
    flights.map(flight => (
      <tr key={flight.name}>
        <td>{flight.name}</td>
        <td>{flight.airline}</td>
        <td>
          <Button
            className="buyInsuranceButton"
            variant="primary"
            type="submit"
            onClick={e => buy(e, flight)}
            disabled={!addressValue}
          >
            Buy
          </Button>
        </td>
      </tr>
    ));

  const getList = e => {
    e.preventDefault();
    update();
  };

  const handleAddressValue = newValue => setAddressValue(newValue);

  const getAddresses = () =>
    Contract.accounts.map(acc => (
      <Dropdown.Item key={acc} onClick={() => handleAddressValue(acc)}>
        {acc}
      </Dropdown.Item>
    ));

  return (
    <Card style={styles.body}>
      <Button
        id="refreshFlight"
        variant="outline-primary"
        type="submit"
        onClick={getList}
      >
        Get List
      </Button>
      {flights && (
        <div>
          <Table style={styles.table}>
            <thead>
              <tr>
                <td>Name</td>
                <td>Airline</td>
                <td>Insurance</td>
              </tr>
            </thead>
            <tbody>{renderFlights()}</tbody>
          </Table>
          <Form>
            <Form.Group controlId="formPassenger">
              <Form.Label>Passenger</Form.Label>
              <Form.Row>
                <Col sm={9}>
                  <Form.Control
                    placeholder="Passenger Wallet"
                    value={addressValue}
                    onChange={e => handleAddressValue(e.target.value)}
                  />
                </Col>
                <Col sm={3}>
                  <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic">
                      Addresses
                    </Dropdown.Toggle>
                    <Dropdown.Menu>{getAddresses()}</Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Form.Row>
            </Form.Group>
            <Form.Group controlId="formValue">
              <Form.Label>Value</Form.Label>
              <Form.Row>
                <Col sm={9}>
                  <Form.Control
                    placeholder="Maximun 1 ether"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                  />
                </Col>
              </Form.Row>
            </Form.Group>
          </Form>
        </div>
      )}
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

export default List;
