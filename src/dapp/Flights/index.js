import React, { useState } from "react";
import Contract from "../contract";
import { Tabs, Tab } from "react-bootstrap";
import Add from "./add";
import Description from "./description";
import List from "./list";
import Status from "./status";

const styles = {
  body: {
    color: "black",
    padding: "0.5rem"
  }
};

const Flights = () => {
  const [flights, setFlights] = useState(null);

  return (
    <Tabs defaultActiveKey="description" id="Airlines-page" style={styles.tabs}>
      <Tab eventKey="description" title="Description">
        <Description />
      </Tab>
      <Tab eventKey="list" title="List">
        <List
          flights={flights}
          update={() => setFlights(Contract.getFlights())}
        />
      </Tab>
      <Tab eventKey="status" title="Status">
        <Status />
      </Tab>
      <Tab eventKey="add" title="Add">
        <Add update={() => setFlights(null)} />
      </Tab>
    </Tabs>
  );
};

export default Flights;
