import { Link, Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./index.css";


const Layout = () => {
  const navigate = useNavigate();

  const user = JSON.parse(Cookies.get("user") || "{}");

  const handleLogout = () => {
    Cookies.remove("jwt_token");
    Cookies.remove("user");

    navigate("/login");
  };

  return (
    <div className="layout">
      <header className="navbar">
        <div className="navbar-logo">
          <Link to="/">Library Management</Link>
        </div>

        <nav className="navbar-links">
          <Link to="/">Home</Link>

          <Link to="/books">Books</Link>

          <Link to="/add-book">Add Book</Link>

          <Link to="/issue-books">Issue Books</Link>

          <Link to="/returned-books">Returned</Link>

          <Link to="/reference-books">Reference</Link>

          <Link to="/payments">Payments</Link>
        </nav>

        <div className="navbar-user">
          <span>{user.name || "User"}</span>

          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
