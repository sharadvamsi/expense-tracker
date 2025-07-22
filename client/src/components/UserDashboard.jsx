import { useEffect, useState } from "react";
import ExpenseCard from "./ExpenseCard";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("view");
  const [expenses, setExpenses] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  
  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/login"); 
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      console.log(token);
      const request = await fetch(
        "https://expense-tracker-hx8p.onrender.com/expenses/view-expenses",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      const response = await request.json();
      console.log(response);
      setExpenses(response);
    };
    fetchData();
  }, [token, navigate]); 

  const [newExpense, setNewExpense] = useState({
    amount: "",
    category: "Travel", // Default category
    date: "",
    notes: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const request = await fetch("https://expense-tracker-hx8p.onrender.com/expenses/add-expense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(newExpense),
    });
    const response = await request.json();

    setExpenses((prev) => [response, ...prev]);
    console.log("New expense submitted:", response);
    // Resetting form and switch back to the view tab
    setNewExpense({ amount: "", category: "Travel", date: "", notes: "" });
    setActiveTab("view");
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
      
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Your Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
          >
            Logout
          </button>
        </div>

        {/* Tabs for switching views */}
        <div className="flex border-b border-gray-300 mb-6">
          <button
            onClick={() => setActiveTab("view")}
            className={`py-2 px-4 font-semibold ${
              activeTab === "view"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            View Expenses
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`py-2 px-4 font-semibold ${
              activeTab === "add"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Add Expense
          </button>
        </div>

        {/* Conditional rendering based on the active tab */}
        <div>
          {activeTab === "view" && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Your Submitted Expenses
              </h2>
              {expenses.length > 0 ? (
                expenses.map((exp) => (
                  <ExpenseCard key={exp._id} expense={exp} />
                ))
              ) : (
                <p className="text-gray-500">
                  You have not submitted any expenses yet.
                </p>
              )}
            </div>
          )}

          {activeTab === "add" && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Add a New Expense
              </h2>
              <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                {/* Amount */}
                <div className="mb-4">
                  <label
                    htmlFor="amount"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Amount (Rs.)
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={newExpense.amount}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 50.75"
                    required
                  />
                </div>

                {/* Category */}
                <div className="mb-4">
                  <label
                    htmlFor="category"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={newExpense.category}
                    onChange={handleInputChange}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Travel</option>
                    <option>Food</option>
                    <option>Accommodation</option>
                    <option>Office Supplies</option>
                    <option>Internet & Communication</option>
                  </select>
                </div>

                {/* Date */}
                <div className="mb-4">
                  <label
                    htmlFor="date"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={newExpense.date}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Notes */}
                <div className="mb-6">
                  <label
                    htmlFor="notes"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={newExpense.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a brief description"
                    required
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
                >
                  Submit Expense
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;