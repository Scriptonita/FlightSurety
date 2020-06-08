import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import Add from "./add";
import Description from "./description";
import Status from "./status";

const styles = {
  tabs: {
    color: "black"
  }
};

const Airlines = () => {
  return (
    <Tabs defaultActiveKey="description" id="Airlines-page" style={styles.tabs}>
      <Tab eventKey="description" title="Description">
        <Description />
      </Tab>
      <Tab eventKey="add" title="Add">
        <Add />
      </Tab>
      <Tab eventKey="status" title="Status">
        <Status />
      </Tab>
    </Tabs>
  );
};

export default Airlines;
