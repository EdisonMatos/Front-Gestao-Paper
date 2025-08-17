import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Login from "./auth/Login";
import PrivateRoute from "./auth/PrivateRoute";

function App() {
  console.log("Renderizando App");

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <div className="min-h-screen bg-background font-mainFont">
              <ToastContainer />
              <Sidebar />
            </div>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
