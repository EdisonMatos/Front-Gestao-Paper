import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("tipo");

  console.log("Token:", token);
  console.log("Tipo:", userType);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
