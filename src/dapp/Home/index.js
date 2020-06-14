import React from "react";
import { Card } from "react-bootstrap";

const styles = {
  card: {
    color: "black",
    textAlign: "center",
    padding: "1rem"
  },
  subcard: {
    textAlign: "left"
  },
  specialWord: {
    color: "red"
  }
};

const Home = () => (
  <Card style={styles.card}>
    <h3>Wellcome to FlightSurety Proyect</h3>
    <Card style={{ ...styles.card, ...styles.subcard }}>
      <p>
        FlightSurety is a sample application project for Udacity's Blockchain
        course.
      </p>
      <ul>
        <li>You can operate if the Operational Status is Ok</li>
        <li>
          Your first step should be to fund first airline created on deploy.
          <br />
          Airlines --&gt; Status --&gt; Select first address
        </li>
      </ul>
    </Card>
  </Card>
);
export default Home;
