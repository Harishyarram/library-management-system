import { useEffect, useState } from "react";
import "./index.css";

const ReferenceBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReferenceBooks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/reference-books");

      const data = await response.json();

      setBooks(data);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferenceBooks();
  }, []);

  if (loading) {
    return <h2>Loading reference books...</h2>;
  }

  return (
    <div className="reference-books-container">
      <h1>Reference Books</h1>

      <p className="reference-info">
        Reference books are available for reading inside the library and cannot
        be issued.
      </p>

      <table className="reference-books-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>ISBN</th>
            <th>Category</th>
            <th>Copies</th>
          </tr>
        </thead>

        <tbody>
          {books.length > 0 ? (
            books.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.isbn}</td>
                <td>{book.category}</td>
                <td>{book.total_quantity}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No reference books available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReferenceBooks;
