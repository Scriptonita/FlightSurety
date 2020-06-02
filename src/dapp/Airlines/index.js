import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import Add from "./add";
import List from "./list";

const styles = {
  tabs: {
    color: "black"
  }
};

const Airlines = () => {
  return (
    <Tabs defaultActiveKey="list" id="Airlines-page" style={styles.tabs}>
      <Tab eventKey="list" title="List">
        <List />
      </Tab>
      <Tab eventKey="add" title="Add">
        <Add />
      </Tab>
      <Tab eventKey="vote" title="Vote">
        <div>Vote for Airline</div>
      </Tab>
    </Tabs>
  );
};

export default Airlines;
