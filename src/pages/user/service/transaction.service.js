import axiosInstance from "../../../AxiosInterceptor";
const TRANSACTION_STATE_URL = "/transaction/stats";
const TRANSACTION_EARNINGS_URL = "/transaction/earnings";

const getTransactionState = () => {
  return axiosInstance.get(`${TRANSACTION_STATE_URL}`);
};

const getTransactionEarnings = (from_date, to_date) => {
  return axiosInstance.get(
    `${TRANSACTION_EARNINGS_URL}?from_date=${from_date}&to_date=${to_date}`
  );
};

export const transactionService = {
  getTransactionState,
  getTransactionEarnings,
};
