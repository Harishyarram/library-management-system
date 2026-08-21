import { useState } from "react";
import "./index.css";

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    total_quantity: "",
    is_reference: false,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/books",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ...formData,
            total_quantity: Number(
              formData.total_quantity
            ),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);

        setFormData({
          title: "",
          author: "",
          isbn: "",
          category: "",
          total_quantity: "",
          is_reference: false,
        });
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.log("Add book error:", error);

      setMessage("Unable to connect to server");
    }
  };

  return (
    <div className="add-book-container">

      <h1>Add Book</h1>

      <form
        className="add-book-form"
        onSubmit={handleSubmit}
      >

        <label>Book Title</label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter book title"
          required
        />


        <label>Author</label>

        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="Enter author name"
          required
        />


        <label>ISBN</label>

        <input
          type="text"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
          placeholder="Enter ISBN"
        />


        <label>Category</label>

        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Example: CSE"
        />


        <label>Total Quantity</label>

        <input
          type="number"
          name="total_quantity"
          value={formData.total_quantity}
          onChange={handleChange}
          min="1"
          placeholder="Enter quantity"
          required
        />


        <div className="reference-checkbox">

          <input
            type="checkbox"
            name="is_reference"
            checked={formData.is_reference}
            onChange={handleChange}
          />

          <label>
            Reference Book
          </label>

        </div>


        <button type="submit">
          Add Book
        </button>

      </form>

      {message && (
        <p className="add-book-message">
          {message}
        </p>
      )}

    </div>
  );
};

export default AddBook;