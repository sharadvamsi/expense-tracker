const AdminExpenseCard = ({ expense, onUpdateStatus }) => {
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
          <p className="text-md font-bold text-gray-600">{expense.category}</p>
          <p className="text-sm text-gray-600">
            Submitted by: User {expense.userId}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(expense.date).toLocaleDateString()}
          </p>
        </div>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
            expense.status
          )}`}
        >
          {expense.status}
        </span>
      </div>
      {expense.notes && (
        <p className="text-gray-700 mt-2 bg-gray-50 p-2 rounded">
          {expense.notes}
        </p>
      )}

      {/* Showing Approve/Reject buttons ONLY if the status is 'Pending' */}
      {expense.status === "Pending" && (
        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={() => onUpdateStatus(expense._id, "Rejected")}
            className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-md hover:bg-red-600 transition-colors"
          >
            Reject
          </button>
          <button
            onClick={() => onUpdateStatus(expense._id, "Approved")}
            className="px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-md hover:bg-green-600 transition-colors"
          >
            Approve
          </button>
        </div>
      )}
    </div>
  );
};
export default AdminExpenseCard;
