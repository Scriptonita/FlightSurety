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
    padding: "1rem"
  },
  check: {
    marginBottom: "1rem"
  }
};

const Reclamation = ({ airline, flight }) => {
  const [addressValue, setAddressValue] = useState("");
  const [payout, setPayout] = useState(false);
  const [insurance, setInsurance] = useState(null);
  const [alert, setAlertValue] = useState({
    show: false,
    variant: "",
    message: ""
  });

  const handleSuccess = message => {
    setAlertValue({ show: true, variant: "success", message });
  };

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

  const checkInsurance = e => {
    e.preventDefault();
    closeAlert();
    setPayout(false);
    Contract.getInsurance(addressValue, airline, flight, (error, result) => {
      if (error) {
        handleError(error.message);
      } else if (result) {
        if (result[0] === "0") {
          const err = new Error();
          err.message =
            "Sorry this passenger have not insurance for this Flight";
          handleError(err);
        } else {
          setInsurance({ value: result[0], state: result[1] });
          setPayout(true);
        }
      }
    });
  };

  const getPayout = e => {
    e.preventDefault();
    Contract.creditInsurees(addressValue, airline, flight, (error, result) => {
      if (error) {
        handleError(error);
      } else if (result) {
        console.log("Result: ", result);
        handleSuccess("Success! Passenger got the paiment in credit");
        setInsurance({ value: insurance.value, state: "Payed" });
      }
    });
  };

  return (
    <Card style={styles.body}>
      <Form>
        <Form.Group controlId="formReclamation">
          <Form.Label>
            Check if a passenger have Insure for this Flight
          </Form.Label>
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
                <Dropdown.Toggle id="dropdown-reclamation">
                  Addresses
                </Dropdown.Toggle>
                <Dropdown.Menu>{getAddresses()}</Dropdown.Menu>
              </Dropdown>
            </Col>
          </Form.Row>
        </Form.Group>
        <Button
          id="checkInsurance"
          variant="outline-primary"
          type="submit"
          onClick={checkInsurance}
          style={styles.check}
        >
          Check
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
      {payout && (
        <div>
          <p>This Passenger have a insurance for this Flight</p>
          <Table striped bordered>
            <tbody>
              <tr>
                <th>Value</th>
                <td>{(insurance.value * 1.5) / 1000000000000000000} Ether</td>
              </tr>
              <tr>
                <th>State</th>
                <td>{insurance.state}</td>
              </tr>
            </tbody>
          </Table>

          <Button
            id="payoutInsurance"
            variant="outline-primary"
            type="submit"
            onClick={getPayout}
            style={styles.check}
            disabled={insurance.state !== "Active"}
          >
            Payout
          </Button>
        </div>
      )}
    </Card>
  );
};

export default Reclamation;
