import React from "react";
import { Modal } from "react-bootstrap";

const DescriptionWithModal = ({ show, onHide, description }) => {
  const handleClose = () => {
    onHide();
  };

  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Description</Modal.Title>
        </Modal.Header>
        <Modal.Body>{description}</Modal.Body>
      </Modal>
    </div>
  );
};

export default DescriptionWithModal;
