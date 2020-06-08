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
    </Card>
  </Card>
);
export default Home;
