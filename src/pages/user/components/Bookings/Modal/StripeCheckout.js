import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { paymentService } from "../../../service/payment.service";
import { toast } from "react-toastify";

const StripeCheckout = ({ onClose, booking_id }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleClose = () => {
    onClose();
  };
  const [isLoading, setIsLoading] = useState(false);
  const [isPayDisable, setIsPayDisable] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPayDisable(true);

    if (!stripe || !elements) {
      setIsPayDisable(false);
      return;
    }

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      console.log(submitError);
      setIsPayDisable(false);
      return;
    }

    paymentService.getPaymentIntent(booking_id).then((res) => {
      stripe
        .confirmPayment({
          elements,
          clientSecret: res.data.client_secret,
          confirmParams: {
            return_url: "https://projects.wappnet.us/tutor/user/bookings"
          },
          redirect: "if_required"
        })
        .then((res) => {
          if (res?.error) {
            toast.error(res?.error?.message);
          } else {
            toast.success("Payment Success");
          }
          handleClose();
        })
        .catch((err) => {
          console.log(err);
          toast.success(err);
        })
        .finally(() => {
          setIsPayDisable(false);
        });
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={`${isPayDisable ? "form-not-clickable" : ""}`}
      >
        <PaymentElement id="payment-element" />
        <button
          className="tu-primbtn-lg tu-primbtn-orange"
          style={{
            height: "40px",
            marginTop: "20px",
            backgroundColor: "#6A307D"
          }}
          disabled={isLoading || !stripe || !elements}
          id="submit"
        >
          <span id="button-text">
            {isLoading ? (
              <div className="spinner" id="spinner"></div>
            ) : (
              "Pay now"
            )}
          </span>
        </button>
      </form>
    </>
  );
};

export default StripeCheckout;
