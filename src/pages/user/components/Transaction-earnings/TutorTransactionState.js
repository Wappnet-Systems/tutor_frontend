import React, { useEffect, useState } from "react";
import { transactionService } from "../../service/transaction.service";
import { Link } from "react-router-dom";
import UserMessageBanner from "../Banner/UserMessageBanner";

const TutorTransactionState = () => {
  const [transactionCount, setTransactionCount] = useState(null);

  useEffect(() => {
    transactionService.getTransactionState().then((res) => {
      setTransactionCount(res?.data?.data);
    });
  }, []);

  return (
    <>
      <div className="tu-profilewrapper transaction-state">
        <UserMessageBanner />
        <div className="tu-boxwrapper">
          {transactionCount && (
            <ul className="tu-incomedetails">
              <li>
                <div className="tu-incomeitem">
                  <div className="tu-incomeprice">
                    <span className="tu-incomeicon">
                      <i className="icon icon-pie-chart"></i>
                    </span>
                    <h5>
                      ${transactionCount?.total_income}.00
                      <span>Total income</span>
                    </h5>
                    <Link to="/user/transaction-earnings">
                      <i className="icon icon-rotate-cw"></i>
                    </Link>
                  </div>
                </div>
              </li>
              <li>
                <div className="tu-incomeitem">
                  <div className="tu-incomeprice">
                    <span className="tu-incomeicon tu-bgpurp">
                      <i className="icon icon-briefcase tu-colorpurp"></i>
                    </span>
                    <h5>
                      ${transactionCount?.income_withdrawn}.00
                      <span>Income withdrawn</span>
                    </h5>
                    <Link to="/user/transaction-earnings">
                      <i className="icon icon-rotate-cw"></i>
                    </Link>
                  </div>
                </div>
              </li>
              <li>
                <div className="tu-incomeitem">
                  <div className="tu-incomeprice">
                    <span className="tu-incomeicon tu-bgred">
                      <i
                        className="icon icon-clock"
                        style={{ color: "red" }}
                      ></i>
                    </span>
                    <h5>
                      ${transactionCount?.pending_income}.00
                      <span>Pending income</span>
                    </h5>
                    <Link to="/user/transaction-earnings">
                      <i className="icon icon-rotate-cw"></i>
                    </Link>
                  </div>
                </div>
              </li>
              <li>
                <div className="tu-incomeitem">
                  <div className="tu-incomeprice">
                    <span className="tu-incomeicon tu-bgblue">
                      <i className="icon icon-shopping-cart tu-colorblue"></i>
                    </span>
                    <h5>
                      ${transactionCount?.available_income}.00
                      <span>Available in account</span>
                    </h5>
                    <Link to="/user/transaction-earnings">
                      <i className="icon icon-rotate-cw"></i>
                    </Link>
                  </div>
                </div>
              </li>
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default TutorTransactionState;
