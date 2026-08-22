import { useEffect, useState } from "react";
import "./index.css";
const API_URL = import.meta.env.VITE_API_URL;

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/books`);

      const data = await response.json();

      if (response.ok) {
        setBooks(data);
      }
    } catch (error) {
      console.log("Books error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  if (loading) {
    return <h2>Loading books...</h2>;
  }

  return (
    <div className="books-container">
      <h1>Library Books</h1>

      <table className="books-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>ISBN</th>
            <th>Category</th>
            <th>Total</th>
            <th>Available</th>
            <th>Type</th>
          </tr>
        </thead>

        <tbody>
          {books.length > 0 ? (
            books.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.isbn || "-"}</td>
                <td>{book.category || "-"}</td>
                <td>{book.total_quantity}</td>
                <td>{book.available_quantity}</td>
                <td>{book.is_reference ? "Reference" : "Normal"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No books available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
