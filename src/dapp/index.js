import React, { useState } from "react";
import ReactDOM from "react-dom";
import Contract from "./contract";
import "./flightsurety.css";
import Airlines from "./Airlines";
import Flights from "./Flights";
import Status from "./Status";
import {
  Button,
  Card,
  Col,
  Container,
  Jumbotron,
  Nav,
  Row,
  Spinner,
  Tab
} from "react-bootstrap";

const styles = {
  card: {
    marginTop: "0.5rem",
    marginBottom: "0.5rem"
  },
  container: {
    marginTop: "3rem",
    paddingTop: "0.5rem"
  },
  jumbotron: {
    paddingTop: "1rem",
    paddingBottom: "1rem"
  },
  loading: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "250px"
  },
  menu: {
    backgroundColor: "#bbb",
    padding: "1rem",
    borderRadius: "0.3rem"
  },
  status: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end"
  },
  title: {
    color: "black",
    paddingLeft: "1rem"
  }
};

const Main = () => {
  const [contractInitialized, setContractInitialized] = useState(false);

  window.addEventListener("contractInitialized", () => {
    setContractInitialized(true);
  });

  return contractInitialized ? (
    <Container style={styles.container}>
      <Card style={styles.card}>
        <Row>
          <Col sm={6}>
            <h2 style={styles.title}>Flightsurety</h2>
          </Col>
          <Col sm={6} style={styles.status}>
            <Status />
          </Col>
        </Row>
      </Card>
      <Jumbotron style={styles.jumbotron}>
        <Tab.Container id="menu" defaultActiveKey="airlines">
          <Row>
            <Col sm={3} style={styles.menu}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="airlines">Airlines</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="passengers">Passengers</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="flights">Flights</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="airlines">
                  <Airlines />
                </Tab.Pane>
                <Tab.Pane eventKey="passengers">
                  <div>Passengers</div>
                </Tab.Pane>
                <Tab.Pane eventKey="flights">
                  <Flights />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Jumbotron>
    </Container>
  ) : (
    <div style={styles.loading}>
      <Button variant="primary" disabled>
        <Spinner
          as="span"
          animation="grow"
          size="sm"
          role="status"
          aria-hidden="true"
        />
        Loading...
      </Button>
    </div>
  );
};

ReactDOM.render(<Main />, document.getElementById("root"));
