import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  if (!localStorage.getItem("access_token")) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
