import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import ErrorPage from "./pages/ErrorPage";
import Dashboard from "./pages/Dashboard";
import GroupSelect from "./pages/GroupSelect";
import JohariTest from "./pages/JohariTest";
import JohariTestEdit from "./pages/JohariTestEdit";
import Header from "./components/Header";
import JohariWindow from "./pages/JohariWindow";
import DashboardForGroup from "./pages/DashboardForGroup";

function App() {
  return (
    <div className="appContainer">
      <Router>
        <Header />
        <main className="body-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/group-select" element={<GroupSelect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/:id" element={<DashboardForGroup />} />
            <Route path="/johari-test/:id" element={<JohariTest />} />
            <Route path="/johari-test/:id/edit" element={<JohariTestEdit />} />
            <Route path="/johari-window" element={<JohariWindow />} />

            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </main>
        <Footer />
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
