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
        Add
        <ul>
          <li>
            You can <span style={styles.specialWord}>register</span> a new
            airline.
          </li>
        </ul>
      </div>
      <div>
        Status
        <ul>
          <li>You can get airlines status.</li>
          <li>
            If airline is not funded then you can{" "}
            <span style={styles.specialWord}>fund</span> it
          </li>
          <li>
            If airline is not registered then you{" "}
            <span style={styles.specialWord}>vote</span> for it
          </li>
        </ul>
      </div>
    </Card>
  </Card>
);
export default Description;
