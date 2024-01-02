import { Navigate } from "react-router-dom";

const PublicRoute = ({ children, protect }) => {
  if (protect && localStorage.getItem("access_token")) {
    return <Navigate to="/user" />;
  }
  return children;
};

export default PublicRoute;
