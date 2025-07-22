import { useEffect, useState } from "react";
import AdminExpenseCard from "./AdminExpenseCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AuditLogCard = ({ log }) => (
  <div className="bg-white shadow-sm rounded-lg p-3 mb-3 border-l-4 border-gray-300">
    {log.action === "status changed" ? (
      <>
        <p className="text-gray-800">status changed by admin</p>
        <p className="text-gray-500">expenseId: {log.expenseId}</p>
        <p className="text-gray-500">userId: {log.userId}</p>
      </>
    ) : (
      <>
        <p className="text-gray-800">{log.action}</p>
        <p className="text-gray-500">expenseId: {log.expenseId}</p>
        <p className="text-gray-500">userId: {log.userId}</p>
      </>
    )}

    <p className="text-xs text-gray-500 mt-1">
      {new Date(log.createdAt).toLocaleString()}
    </p>
  </div>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("expenses");
  const token = localStorage.getItem("token");
  const [allExpenses, setAllExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  const [activeChart, setActiveChart] = useState("category");
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loadingCharts, setLoadingCharts] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const request = await fetch("http://localhost:5000/admin/view-expenses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const response = await request.json();
      console.log(response);
      setAllExpenses(response);
      setFilteredExpenses(response);

      const requestaudit = await fetch(
        "http://localhost:5000/admin/audit-logs",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      const responseaudit = await requestaudit.json();
      setAuditLogs(responseaudit);
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchChartData = async () => {
      setLoadingCharts(true);
      try {
        // Fetch data for both charts in parallel
        const [categoryRes, monthRes] = await Promise.all([
          fetch("http://localhost:5000/admin/expense-by-category", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }),
          fetch("http://localhost:5000/admin/expense-by-month", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }),
        ]);

        if (!categoryRes.ok || !monthRes.ok) {
          throw new Error("Failed to fetch chart data");
        }

        const categoryJson = await categoryRes.json();
        const monthJson = await monthRes.json();

        setCategoryData(categoryJson);
        setMonthlyData(monthJson);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoadingCharts(false);
      }
    };

    fetchChartData();
  }, []);

  const [filters, setFilters] = useState({
    userId: "",
    status: "Pending",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = async (e) => {
    console.log("Calling API to fetch filtered data with:", filters);
    const queryParams = new URLSearchParams();

    if (filters.status) {
      queryParams.append("status", filters.status);
    }

    if (filters.userId) {
      queryParams.append("userId", filters.userId);
    }

    const url = `http://localhost:5000/admin/view-expenses?${queryParams.toString()}`;

    console.log("Calling:", url);

    const request = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await request.json();
    console.log("Filtered data:", data);
    setFilteredExpenses(data);
  };

  const handleUpdateStatus = async (expenseId, status) => {
    console.log(`Calling API: Update expense ${expenseId} to status ${status}`);

    const request = await fetch(
      `http://localhost:5000/admin/change-status/${expenseId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ status }),
      }
    );
    const response = await request.json();
    console.log(response);

    const updatedExpenses = allExpenses.map((exp) =>
      exp._id === expenseId ? { ...exp, status: status } : exp
    );
    setAllExpenses(updatedExpenses);
    setFilteredExpenses(updatedExpenses);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Admin Dashboard
        </h1>

        <div className="flex border-b border-gray-300 mb-6">
          <button
            onClick={() => setActiveTab("expenses")}
            className={`py-2 px-4 font-semibold ${
              activeTab === "expenses"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            View All Expenses
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`py-2 px-4 font-semibold ${
              activeTab === "logs"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Audit Logs
          </button>
          <button
            onClick={() => setActiveTab("charts")}
            className={`py-2 px-4 font-semibold ${
              activeTab === "charts"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Charts
          </button>
        </div>

        <div>
          {activeTab === "expenses" && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                All User Expenses
              </h2>

              {/* **NEW**: Filter Section */}
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-full sm:w-auto flex-grow">
                  <label
                    htmlFor="userId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    UserId
                  </label>
                  <input
                    id="userId"
                    name="userId"
                    type="text"
                    placeholder="Enter userId to filter"
                    value={filters.userId}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  />
                </div>
                <div className="w-full sm:w-auto flex-grow">
                  <label
                    htmlFor="status-filter"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Status
                  </label>
                  <select
                    id="status-filter"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                  </select>
                </div>
                <div className="w-full sm:w-auto pt-5">
                  <button
                    onClick={applyFilters}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
                  >
                    Filter
                  </button>
                </div>
              </div>

              {/* Display the filtered list */}
              {filteredExpenses.map((exp) => (
                <AdminExpenseCard
                  key={exp._id}
                  expense={exp}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
              {filteredExpenses.length === 0 && (
                <p className="text-center text-gray-500 mt-6">
                  No expenses match the current filters.
                </p>
              )}
            </div>
          )}

          {activeTab === "logs" && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                System Audit Logs
              </h2>
              {auditLogs.map((log) => (
                <AuditLogCard key={log._id} log={log} />
              ))}
            </div>
          )}

          {activeTab === "charts" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Expense Insights
              </h2>

              {/* Chart type selection */}
              <div className="flex justify-center space-x-2 mb-6 border-b pb-2">
                <button
                  onClick={() => setActiveChart("category")}
                  className={`px-4 py-2 text-sm font-bold rounded-lg ${
                    activeChart === "category"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  By Category
                </button>
                <button
                  onClick={() => setActiveChart("month")}
                  className={`px-4 py-2 text-sm font-bold rounded-lg ${
                    activeChart === "month"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  By Month
                </button>
              </div>

              {loadingCharts ? (
                <p className="text-center text-gray-500">
                  Loading Chart Data...
                </p>
              ) : (
                <div style={{ width: "100%", height: 400 }}>
                  <ResponsiveContainer>
                    {activeChart === "category" ? (
                      // Bar Chart for Category Data
                      <BarChart
                        data={categoryData}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => `Rs. ${value.toFixed(2)}`}
                        />
                        <Legend />
                        <Bar
                          dataKey="total"
                          fill="#3b82f6"
                          name="Total Expenses"
                        />
                      </BarChart>
                    ) : (
                      // Bar Chart for Monthly Data
                      <BarChart
                        data={monthlyData}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => `Rs. ${value.toFixed(2)}`}
                        />
                        <Legend />

                        <Bar
                          dataKey="total"
                          fill="#16a34a"
                          name="Total Expenses"
                        />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
