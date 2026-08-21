import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./index.css";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    const token = Cookies.get("jwt_token");

    try {
      const response = await fetch("http://localhost:5000/api/my-payments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setPayments(data);
      }
    } catch (error) {
      console.log("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading) {
    return <h2>Loading payments...</h2>;
  }

  return (
    <div className="payments-container">
      <h1>Payment Details</h1>

      <table className="payments-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Book</th>
            <th>Amount</th>
            <th>Payment Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {payments.length > 0 ? (
            payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.title}</td>
                <td>₹{payment.amount}</td>
                <td>{payment.payment_date}</td>
                <td>{payment.payment_status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No payment records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Payments;
