import React from "react";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import StripeCheckout from "./StripeCheckout";
const stripePromise =
  loadStripe(process.env.REACT_APP_STRIPE_PUB_KEY);

const PaymentPopup = ({ onClose, booking_id, booking_amount }) => {
  const handleClose = () => {
    onClose();
  };

  const options = {
    mode: 'payment',
    currency: 'inr',
    amount: booking_amount,
    fields: {
      billingDetails: {
          address: {
              country: 'never',
              postalCode: 'never'
          }
      }
  }
  };

  return (
    <>
      <div
        className="modal fade  d-block  tuturn-profilepopup review-popup tu-uploadprofile tuturn-popup show"
        tabindex={-1}
        role="dialog"
        id="tuturn-modal-popup"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="tuturn-modalcontent modal-content">
            <div id="tuturn-model-body">
              <div className="modal-header">
                <h5>Make Payment</h5>
                <a
                  href="javascript:void(0);"
                  className="tu-close "
                  type="button"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={handleClose}
                >
                  <i className="icon icon-x"></i>
                </a>
              </div>
              <div className="modal-body">
                <Elements stripe={stripePromise} options={options}>
                  <StripeCheckout onClose={onClose} booking_id={booking_id}></StripeCheckout>
                </Elements>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default PaymentPopup;
