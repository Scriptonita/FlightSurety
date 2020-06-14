import React, { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Dropdown,
  Table
} from "react-bootstrap";
import Contract from "../contract";
import Withdraw from "./withdraw";

const styles = {
  card: {
    color: "black",
    textAlign: "left",
    padding: "1rem"
  },
  button: {
    marginBottom: "1rem"
  },
  table: {
    marginTop: "1rem"
  }
};

const Status = () => {
  const [addressValue, setAddressValue] = useState("");
  const [passenger, setPassenger] = useState();
  const [withdraw, setWithdraw] = useState(false);
  const [alert, setAlertValue] = useState({
    show: false,
    variant: "",
    message: ""
  });

  const handleError = error => {
    setAlertValue({ show: true, variant: "danger", message: error.message });
  };

  const closeAlert = () => {
    setAlertValue({ show: false, variant: "", message: "" });
  };

  const handleAddressValue = newValue => setAddressValue(newValue);

  const getAddresses = () =>
    Contract.accounts.map(acc => (
      <Dropdown.Item key={acc} onClick={() => handleAddressValue(acc)}>
        {acc}
      </Dropdown.Item>
    ));

  const getStatus = e => {
    e.preventDefault();
    closeAlert();
    setPassenger(null);
    setWithdraw(null);
    Contract.getPassenger(addressValue, (error, result) => {
      if (error) {
        handleError(error);
      } else {
        setPassenger({
          credit: parseFloat(result[0]),
          insurances: result[1]
        });
      }
    });
  };

  return (
    <Card style={styles.card}>
      <Form.Group controlId="formGetPassenger">
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
              <Dropdown.Toggle id="dropdown-airlines-basic">
                Addresses
              </Dropdown.Toggle>
              <Dropdown.Menu>{getAddresses()}</Dropdown.Menu>
            </Dropdown>
          </Col>
        </Form.Row>
      </Form.Group>
      <Button
        id="getPassenger"
        variant="outline-primary"
        type="submit"
        onClick={getStatus}
        style={styles.button}
      >
        Get Status
      </Button>
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
      {passenger && (
        <Table style={styles.table} striped bordered>
          <thead>
            <tr>
              <td>Active Insurances</td>
              <td>Credit</td>
              <td>Withdraw</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{passenger.insurances}</td>
              <td>{passenger.credit / 1000000000000000000} Ethers</td>
              <td>
                <Button
                  id="withdraw"
                  variant="outline-primary"
                  type="submit"
                  onClick={() => setWithdraw(!withdraw)}
                  // disabled={passenger.credit === 0}
                >
                  Withdraw
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
      )}
      {withdraw && (
        <Withdraw passenger={addressValue} credit={passenger.credit} />
      )}
    </Card>
  );
};

export default Status;
