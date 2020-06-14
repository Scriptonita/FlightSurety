import React, { useState } from "react";
import Contract from "../contract";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";

const styles = {
  card: {
    marginTop: "1rem",
    padding: "1rem",
    color: "black"
  }
};
const Withdraw = ({ passenger, credit }) => {
  const [ethers, setEthers] = useState(credit / 1000000000000000000);
  const [alert, setAlertValue] = useState({
    show: false,
    variant: "",
    message: ""
  });

  const handleSucces = message => {
    setAlertValue({ show: true, variant: "success", message });
  };

  const handleError = error => {
    setAlertValue({ show: true, variant: "danger", message: error.message });
  };

  const closeAlert = () => {
    setAlertValue({ show: false, variant: "", message: "" });
  };

  const transferCredit = e => {
    e.preventDefault();
    console.log("Passenger: ", passenger);
    console.log("Ethers: ", ethers);
    Contract.pay(passenger, ethers, (error, result) => {
      if (error) {
        handleError(error);
      } else {
        handleSucces(
          `Success! ${ethers} Ethers were transfered to passeger's Wallet`
        );
      }
    });
  };

  return (
    <Card style={styles.card}>
      <Form>
        <p>How many Ethers?</p>
        <Row>
          <Col sm={4}>
            <Form.Group controlId="formWithdraw">
              <Form.Control
                placeholder="Ethers"
                value={ethers}
                onChange={e => setEthers(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col sm={3}>
            <Button
              id="withdrawCredit"
              variant="outline-primary"
              type="submit"
              onClick={transferCredit}
            >
              Transfer
            </Button>
          </Col>
        </Row>
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

export default Withdraw;
