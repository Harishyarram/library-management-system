import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./index.css";

const ReturnedBooks = () => {
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState("");

  const fetchBooks = async () => {
    const token = Cookies.get("jwt_token");

    try {
      const response = await fetch(
        "http://localhost:5000/api/my-book-history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        setBooks(data);
      }
    } catch (error) {
      console.log("History error:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleReturn = async (issueId) => {
    const token = Cookies.get("jwt_token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/books/return/${issueId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      setMessage(data.message);

      if (response.ok) {
        fetchBooks();
      }
    } catch (error) {
      console.log(error);
      setMessage("Unable to connect to server");
    }
  };

  return (
    <div className="returned-books-container">
      <h1>Book History</h1>

      {message && <p className="return-message">{message}</p>}

      <table className="returned-books-table">
        <thead>
          <tr>
            <th>Book</th>
            <th>Issue Date</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {books.length > 0 ? (
            books.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.issue_date}</td>
                <td>{book.due_date}</td>

                <td>{book.status === "issued" ? "Issued" : "Returned"}</td>

                <td>
                  {book.status === "issued" ? (
                    <button onClick={() => handleReturn(book.id)}>
                      Return
                    </button>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No book history found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReturnedBooks;
