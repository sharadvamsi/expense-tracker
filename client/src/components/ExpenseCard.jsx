const ExpenseCard = ({ expense }) => {
  // Function to determine the color of the status badge
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-lg font-bold text-gray-800">
            Rs. {expense.amount}
          </p>
          <p className="text-sm text-gray-600">{expense.category}</p>
        </div>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
            expense.status
          )}`}
        >
          {expense.status}
        </span>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        {new Date(expense.date).toLocaleDateString()}
      </p>
      {expense.notes && (
        <p className="text-gray-700 mt-2 bg-gray-50 p-2 rounded">
          {expense.notes}
        </p>
      )}
    </div>
  );
};

export default ExpenseCard;
