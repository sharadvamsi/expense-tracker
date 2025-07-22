import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(!loading);
    console.log("Login successful! Data saved:", formData);
    const request = await fetch("http://localhost:5000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const response = await request.json();
    if (request.ok === true) {
      setLoading(!loading);
      toast("login Success.");

      const token = localStorage.setItem("token", response.token);
      const authenticate = await fetch(
        "http://localhost:5000/user/user-details",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: response.token,
          },
        }
      );
      const data = await authenticate.json();
      data.role === "admin"
        ? navigate("/admin-dashboard")
        : navigate("/user-dashboard");
    } else {
      toast(response.err);
    }
    
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Expense Tracker
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline transition-colors duration-300"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-blue-600 hover:text-blue-800"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
