import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./index.css";

const Home = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    const token = Cookies.get("jwt_token");

    try {
      const response = await fetch("http://localhost:5000/api/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Dashboard response:", response.status, data);
      if (response.ok) {
        setDashboard(data);
      }
    } catch (error) {
      console.log("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <h2>Loading dashboard...</h2>;
  }

  if (!dashboard) {
    return <h2>Unable to load dashboard</h2>;
  }

  return (
    <div className="home-container">
      <h1>Library Dashboard</h1>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total Books</h3>
          <p>{dashboard.totalBooks}</p>
        </div>

        <div className="dashboard-card">
          <h3>Available Books</h3>
          <p>{dashboard.availableBooks}</p>
        </div>

        <div className="dashboard-card">
          <h3>Issued Books</h3>
          <p>{dashboard.issuedBooks}</p>
        </div>

        <div className="dashboard-card">
          <h3>Returned Books</h3>
          <p>{dashboard.returnedBooks}</p>
        </div>

        <div className="dashboard-card">
          <h3>Reference Books</h3>
          <p>{dashboard.referenceBooks}</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Payments</h3>
          <p>₹{dashboard.payments}</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
