import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";
import Contract from "../contract";

const styles = {
  body: {
    color: "black",
    textAlign: "right",
    padding: "0.5rem"
  }
};

const Status = () => {
  const [isOperational, setIsOperational] = useState();
  const contract = new Contract("localhost", () => {
    contract.isOperational((error, result) => {
      setIsOperational(result);
    });
  });

  const renderStatus = () =>
    isOperational ? (
      <FontAwesomeIcon icon={faCheckCircle} color="green" />
    ) : (
      <FontAwesomeIcon icon={faTimesCircle} color="red" />
    );

  return (
    <div style={styles.body}>
      <span>Operational Status </span>
      {renderStatus()}
    </div>
  );
};

export default Status;
