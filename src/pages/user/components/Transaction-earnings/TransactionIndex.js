import React from "react";
import TutorTransactionState from "./TutorTransactionState";
import TutorTransactionEarnings from "./TutorTransactionEarnings";

const TransactionIndex = () => {
  return (
    <>
      <TutorTransactionState />
      <TutorTransactionEarnings />
    </>
  );
};

export default TransactionIndex;
