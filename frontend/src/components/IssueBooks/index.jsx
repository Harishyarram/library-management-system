import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./index.css";
const API_URL = import.meta.env.VITE_API_URL;

const IssueBooks = () => {
  const [books, setBooks] = useState([]);
  const [bookId, setBookId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/books`);

      const data = await response.json();

      setBooks(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleIssueBook = async (e) => {
    e.preventDefault();

    const token = Cookies.get("jwt_token");

    try {
      const response = await fetch("http://localhost:5000/api/books/issue", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          bookId,
          dueDate,
        }),
      });

      const data = await response.json();

      setMessage(data.message);

      if (response.ok) {
        setBookId("");
        setDueDate("");

        fetchBooks();
      }
    } catch (error) {
      console.log(error);

      setMessage("Unable to connect to server");
    }
  };

  return (
    <div className="issue-books-container">
      <h1>Issue Book</h1>

      <form onSubmit={handleIssueBook}>
        <label>Select Book</label>

        <select
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          required
        >
          <option value="">Select a book</option>

          {books
            .filter((book) => book.available_quantity > 0 && !book.is_reference)
            .map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} - Available: {book.available_quantity}
              </option>
            ))}
        </select>

        <label>Due Date</label>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />

        <button type="submit">Issue Book</button>
      </form>

      {message && <p className="issue-message">{message}</p>}
    </div>
  );
};

export default IssueBooks;
