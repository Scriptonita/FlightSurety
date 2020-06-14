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
        Status
        <ul>
          <li>View the passenger state.</li>
          <li>
            If passenger have <span style={styles.specialWord}>credits</span>,
            they can be <span style={styles.specialWord}>transfered</span> to
            passenger's wallet.
          </li>
        </ul>
      </div>
    </Card>
  </Card>
);
export default Description;
