import React, { useState } from "react";
import { CircleDollarSign, X, Save } from "lucide-react";
import Modal from "../Modal";
import { toast } from "react-toastify";
import { useBudget } from "../../hooks/useBudget";

const CreateBudgetModal = ({ isOpen, onClose, onSuccess, occasions = [] }) => {
  const { addBudget } = useBudget(); // Gọi hàm addBudget từ Context
  const [formData, setFormData] = useState({
    name: "",
    totalAmount: "",
    occasionId: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter a budget name");
      return;
    }
    if (!formData.totalAmount || isNaN(formData.totalAmount)) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!formData.occasionId) {
      toast.error("Please select an occasion");
      return;
    }

    setLoading(true);
    try {
      // Sử dụng hàm từ Context
      const res = await addBudget({
        name: formData.name,
        totalAmount: parseFloat(formData.totalAmount),
        occasionId: formData.occasionId,
      });

      if (res.success) {
        toast.success("Budget created successfully!");
        setFormData({ name: "", totalAmount: "", occasionId: "" });
        onSuccess?.(); // Gọi callback để component cha biết và refresh lại list ngân sách
        onClose();
      }
    } catch (error) {
      // Context đã xử lý error.message, nên ta chỉ cần gọi ra
      toast.error(error.message || "Failed to create budget");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="500px" hideHeader={true}>
      {/* Khối bọc ngoài cùng với opacity-100 và shadow đậm để tách biệt hoàn toàn với nền */}
      <div className="flex flex-col bg-white shadow-2xl rounded-2xl opacity-100">
        {/* Header: Chuyển sang nền trắng, chữ đen */}
        <div className="bg-white p-6 text-black border-b border-gray-200 relative flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg text-black">
              <CircleDollarSign size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">New Budget Plan</h2>
              <p className="text-gray-600 text-sm">
                Start a new financial plan for Tet.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 hover:text-black rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="p-8 bg-white rounded-b-2xl flex flex-col gap-6"
        >
          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Budget Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. Traditional Food Budget"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-2xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-black font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Select Occasion
            </label>
            <select
              value={formData.occasionId}
              onChange={(e) =>
                setFormData({ ...formData, occasionId: e.target.value })
              }
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-2xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-black font-medium appearance-none"
              required
            >
              <option value="">Choose an occasion...</option>
              {occasions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Total Budget (VNĐ)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium italic">
                đ
              </span>
              <input
                type="number"
                value={formData.totalAmount}
                onChange={(e) =>
                  setFormData({ ...formData, totalAmount: e.target.value })
                }
                placeholder="0"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-2xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-black font-medium"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3.5 text-black font-bold hover:bg-gray-100 border border-gray-300 rounded-2xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-black text-white font-bold rounded-2xl shadow-md hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <Save size={20} />
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateBudgetModal;
