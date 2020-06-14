import React, { useState } from "react";
import Contract from "../contract";
import { Tabs, Tab } from "react-bootstrap";
// import Add from "./add";
import Description from "./description";
import Status from "./status";
// import Search from "./search";

const styles = {
  body: {
    color: "black",
    padding: "0.5rem"
  }
};

const Passengers = () => {
  return (
    <Tabs defaultActiveKey="description" id="Airlines-page" style={styles.tabs}>
      <Tab eventKey="description" title="Description">
        <Description />
      </Tab>
      <Tab eventKey="status" title="Status">
        <Status />
      </Tab>
      {/* <Tab eventKey="search" title="Search">
        <Search />
      </Tab>
      <Tab eventKey="add" title="Add">
        <Add update={() => setFlights(null)} />
      </Tab> */}
    </Tabs>
  );
};

export default Passengers;
