import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import OtpInput from "react-otp-input";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import AuthBanner from "../../../components/common/AuthBanner";
import whiteLogo from "../../../assets/login/logo_white.png";
import authBannerImg from "../../../assets/login/auth_img.jpg";
import { authService } from "../service/authService";

const OtpVerification = () => {
  const navigate = useNavigate();
  const signupEmailValue = useSelector((state) => state?.signup?.signupEmail);
  const [resendTimer, setResendTimer] = useState(0);
  const initialValues = {};
  const [code, setCode] = useState(null);

  const handleChange = (code) => setCode(code);
  const validationSchema = Yup.object({});

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: () => {
      verifyOtp();
    }
  });

  const verifyOtp = () => {
    authService
      .verifyOtp({
        email: signupEmailValue,
        otp: code
      })
      .then((response) => {
        setResendTimer(0);
        setCode(null);
        formik.resetForm();
        navigate("/login");
        toast.success(response?.data?.message?.[0]);
      });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const handleResendOtp = async (val) => {
    if (val === true) {
      setResendTimer(60);
      authService
        .resendOtp({
          email: signupEmailValue
        })
        .then((response) => {
          setCode(null);
          toast.success(response?.data?.message?.[0]);
        });
    } else {
      setResendTimer(60);
    }
  };

  useEffect(() => {
    if (resendTimer > 0) {
      const intervalId = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [resendTimer]);

  useEffect(() => {
    if (signupEmailValue === null) {
      navigate("/login");
    }
    handleResendOtp();
  }, []);

  return (
    <>
      <div className="tu-main-login">
        <AuthBanner
          logoImg={whiteLogo}
          bannerImg={authBannerImg}
          bannerTitle="Yes! we’re making progress"
          bannerSmallText="every minute & every second"
        />
        <div className="tu-login-right">
          <div className="tu-login-right_title">
            <h2>Enter the OTP</h2>

            <p>Enter the OTP that we sent to your email {signupEmailValue} .</p>
          </div>
          <form
            className="tu-themeform tu-login-form"
            onSubmit={formik.handleSubmit}
          >
            <fieldset>
              <div className="tu-themeform__wrap">
                <div className="form-group-wrap">
                  <div className="form-group">
                    <div className="w-100 d-flex align-align-items-center justify-content-center">
                      <OtpInput
                        value={code}
                        onChange={handleChange}
                        numInputs={4}
                        renderInput={(props) => <input {...props} />}
                        isInputNum={true}
                        renderSeparator={<span className="mx-2">-</span>}
                        shouldAutoFocus={true}
                        inputType="number"
                        inputStyle={{
                          border: "1px solid",
                          borderRadius: "8px",
                          width: "54px",
                          height: "54px",
                          fontSize: "12px",
                          color: "#000",
                          fontWeight: "400",
                          caretColor: "blue"
                        }}
                        focusStyle={{
                          border: "1px solid #CFD3DB",
                          outline: "none"
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <button
                      type="submit"
                      disabled={!code}
                      className="tu-primbtn-lg w-100"
                    >
                      <span>Verify OTP</span>
                      <i className="icon icon-arrow-right"></i>
                    </button>
                  </div>
                  <div className="form-group justify-content-center mt-2">
                    <span className="me-2">Didn't get the code ? </span>
                    <button
                      className="resend_button"
                      type="button"
                      onClick={() => handleResendOtp(true)}
                      disabled={resendTimer > 0}
                    >
                      {resendTimer > 0
                        ? `(${formatTime(resendTimer)})`
                        : " Resend It"}
                    </button>
                  </div>
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </>
  );
};

export default OtpVerification;
