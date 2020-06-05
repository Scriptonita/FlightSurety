import React, { useState } from "react";
import Contract from "../contract";
import { Button, Card, Col, Dropdown, Form } from "react-bootstrap";

const styles = {
  card: {
    marginTop: "1rem",
    padding: "1rem",
    color: "black"
  }
};
const Vote = ({ toVote, onSuccess }) => {
  const [addressValue, setAddressValue] = useState("");

  const getAddresses = () =>
    Contract.accounts.map(acc => (
      <Dropdown.Item key={acc} onClick={() => setAddressValue(acc)}>
        {acc}
      </Dropdown.Item>
    ));

  const vote = e => {
    e.preventDefault();
    Contract.voteAirline(addressValue, toVote, (error, result) => {
      if (error) {
        console.log("Error: ", error);
      } else {
        console.log("Result: ", result);
        onSuccess(e);
      }
    });
  };

  return (
    <Card style={styles.card}>
      <Form>
        <Form.Group controlId="formVoteAirline">
          <Form.Label>Vote airline from address:</Form.Label>
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
                <Dropdown.Toggle id="dropdownVoteAirline">
                  Addresses
                </Dropdown.Toggle>
                <Dropdown.Menu>{getAddresses()}</Dropdown.Menu>
              </Dropdown>
            </Col>
          </Form.Row>
        </Form.Group>
        <Button
          id="voteAirline"
          variant="outline-primary"
          type="submit"
          onClick={vote}
        >
          Vote
        </Button>
      </Form>
    </Card>
  );
};

export default Vote;
