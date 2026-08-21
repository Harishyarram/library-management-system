import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import Books from "./components/Books";
import AddBook from "./components/AddBook";
import IssueBooks from "./components/IssueBooks";
import ReturnedBooks from "./components/ReturnedBooks";
import ReferenceBooks from "./components/ReferenceBooks";
import Payments from "./components/Payments";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />

          <Route path="books" element={<Books />} />

          <Route path="add-book" element={<AddBook />} />

          <Route path="issue-books" element={<IssueBooks />} />

          <Route path="returned-books" element={<ReturnedBooks />} />

          <Route path="reference-books" element={<ReferenceBooks />} />

          <Route path="payments" element={<Payments />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
