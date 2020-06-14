import React from "react";
import { Card } from "react-bootstrap";

const styles = {
  card: {
    color: "black",
    textAlign: "left",
    padding: "1rem"
  },
  subheader: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    textDecoration: "underline"
  },
  specialWord: {
    color: "red"
  }
};

const Description = () => (
  <Card style={styles.card}>
    <Card style={styles.card}>
      <div>
        List
        <ul>
          <li>List of available Flights.</li>
          <li>
            There are 4 flights creates by default by the (unfunded){" "}
            <span style={styles.specialWord}>first airline</span> created on
            deploy.
          </li>
          <li>
            If passenger is selected you can{" "}
            <span style={styles.specialWord}>buy an Insurance.</span>
          </li>
        </ul>
      </div>
      <div>
        Status
        <ul>
          <li>
            Submit a flight to <span style={styles.specialWord}>Oracles</span>
          </li>
          <li>If flight is late, passengers can claim insurances</li>
          <li>
            Passenger can <span style={styles.specialWord}>withdraw</span>{" "}
            insurance value in credits
          </li>
        </ul>
      </div>
      <div>
        Add
        <ul>
          <li>Add new Flights.</li>
        </ul>
      </div>
    </Card>
  </Card>
);
export default Description;
