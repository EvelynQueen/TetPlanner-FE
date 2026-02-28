// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const CreateShoppingItem = () => {
//   const [formData, setFormData] = useState({
//     user_id: "UUID-12345",
//     name: "",
//     quantity: 1,
//     price: 0,
//     note: "",
//     category_id: "",
//     budget_id: "",
//     occasion: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 600);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type } = e.target;
//     if (name === "name") setError(null);
//     setFormData({
//       ...formData,
//       [name]: type === "number" ? Number(value) : value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.name.trim()) {
//       setError("Item name is required");
//       return;
//     }
//     setLoading(true);
//     try {
//       await axios.post("/api/shopping-item/create", formData);
//       alert("Success!");
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const styles = {
//     card: {
//       width: "95%",
//       maxWidth: "574px",
//       margin: "var(--space-7) auto",
//       backgroundColor: "var(--color-bg-card)",
//       borderRadius: "var(--radius-md)",
//       boxShadow: "var(--shadow-lg)",
//       position: "relative",
//       overflow: "hidden",
//     },
//     closeBtn: {
//       position: "absolute",
//       top: "var(--space-4)",
//       right: "var(--space-4)",
//       width: "32px",
//       height: "32px",
//       borderRadius: "50%",
//       backgroundColor: "rgba(255,255,255,0.2)",
//       color: "var(--color-text-inverse)",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       cursor: "pointer",
//       border: "none",
//       fontSize: "var(--fs-xl)",
//       zIndex: 10,
//     },
//     header: {
//       background: "var(--gradient-primary)",
//       padding: "var(--space-6) var(--space-7)",
//       color: "var(--color-text-inverse)",
//     },
//     form: {
//       padding: "var(--space-6) var(--space-7)",
//       display: "flex",
//       flexDirection: "column",
//       gap: "var(--space-5)",
//     },
//     row: {
//       display: "flex",
//       gap: "var(--space-4)",
//       flexDirection: isMobile ? "column" : "row",
//     },
//     inputGroup: {
//       display: "flex",
//       flexDirection: "column",
//       gap: "var(--space-2)",
//       width: "100%",
//     },
//     label: {
//       fontSize: "var(--fs-sm)",
//       fontWeight: "var(--fw-semibold)",
//       color: "var(--color-text-primary)",
//     },
//     input: {
//       padding: "var(--space-3)",
//       border: "1px solid var(--color-border-medium)",
//       borderRadius: "var(--radius-sm)",
//       fontSize: "var(--fs-md)",
//       backgroundColor: "var(--color-bg-main)",
//       color: "var(--color-text-primary)",
//       outline: "none",
//       fontFamily: "inherit",
//       transition: "all 0.2s ease",
//     },

//     errorBox: {
//       borderRadius: "var(--radius-md)",
//       border: `1px solid var(--color-danger)`,
//       background: "rgba(239, 68, 68, 0.05)",
//       padding: "var(--space-3) var(--space-4)",
//       color: "var(--color-danger)",
//       fontSize: "var(--fs-sm)",
//     },
//     footer: {
//       display: "flex",
//       gap: "var(--space-3)",
//       marginTop: "var(--space-4)",
//     },
//     btnSave: {
//       flex: 4,
//       padding: "var(--space-4)",
//       background: "var(--btn-primary-bg)",
//       color: "var(--btn-primary-text)",
//       boxShadow: "var(--btn-primary-shadow)",
//       border: "none",
//       borderRadius: "var(--radius-md)",
//       fontWeight: "var(--fw-semibold)",
//       cursor: "pointer",
//       transition: "all 0.2s ease",
//       fontSize: "var(--fs-md)",
//     },
//     btnCancel: {
//       flex: 1,
//       padding: "var(--space-4)",
//       backgroundColor: "var(--color-bg-sidebar)",
//       color: "var(--color-text-secondary)",
//       border: "none",
//       borderRadius: "var(--radius-md)",
//       fontWeight: "var(--fw-medium)",
//       cursor: "pointer",
//       fontSize: "var(--fs-md)",
//     },
//   };

//   return (
//     <div style={styles.card}>
//       <button style={styles.closeBtn} onClick={() => alert("Closed")}>
//         &times;
//       </button>

//       <div style={styles.header}>
//         <h2
//           style={{
//             margin: 0,
//             fontSize: "var(--fs-2xl)",
//             fontWeight: "var(--fw-semibold)",
//           }}
//         >
//           Add New Item
//         </h2>
//         <h3
//           style={{
//             margin: 0,
//             fontSize: "var(--fs-sm)",
//             fontWeight: "var(--fw-regular)",
//           }}
//         >
//           Plan ahead for a prosperous New Year.
//         </h3>
//       </div>

//       <form style={styles.form} onSubmit={handleSubmit}>
//         {/* Item name */}
//         <div style={styles.inputGroup}>
//           <label style={styles.label}>Item name *</label>
//           <input
//             style={{
//               ...styles.input,
//               borderColor: error
//                 ? "var(--color-danger)"
//                 : "var(--color-border-medium)",
//             }}
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             placeholder="E.g. Buying Flowers"
//           />
//           {error && (
//             <div style={styles.errorBox}>
//               <strong style={{ fontWeight: "var(--fw-bold)" }}>
//                 An error occurred.
//               </strong>
//               <br />
//               {error}
//             </div>
//           )}
//         </div>

//         {/* Category & Quantity */}
//         <div style={styles.row}>
//           <div style={{ ...styles.inputGroup, flex: 2 }}>
//             <label style={styles.label}>Category</label>
//             <select
//               name="category_id"
//               style={styles.input}
//               value={formData.category_id}
//               onChange={handleChange}
//             >
//               <option value="">Select category</option>
//               <option value="1">Food & Drinks</option>
//               <option value="2">Decorations</option>
//             </select>
//           </div>
//           <div style={{ ...styles.inputGroup, flex: 1 }}>
//             <label style={styles.label}>Quantity</label>
//             <input
//               style={styles.input}
//               type="number"
//               name="quantity"
//               value={formData.quantity}
//               onChange={handleChange}
//             />
//           </div>
//         </div>

//         {/* Budget */}
//         <div style={styles.inputGroup}>
//           <label style={styles.label}>Estimate Budget (VND)</label>
//           <input
//             style={styles.input}
//             type="number"
//             name="price"
//             value={formData.price}
//             onChange={handleChange}
//           />
//         </div>

//         {/* Occasion */}
//         <div style={styles.inputGroup}>
//           <label style={styles.label}>Occasion</label>
//           <input
//             style={styles.input}
//             type="text"
//             name="occasion"
//             value={formData.occasion}
//             onChange={handleChange}
//             placeholder=""
//           />
//         </div>

//         {/* Note */}
//         <div style={styles.inputGroup}>
//           <label style={styles.label}>Note</label>
//           <textarea
//             style={{ ...styles.input, height: "80px", resize: "none" }}
//             name="note"
//             value={formData.note}
//             onChange={handleChange}
//           />
//         </div>

//         {/* Footer */}
//         <div style={styles.footer}>
//           <button
//             type="button"
//             style={styles.btnCancel}
//             onClick={() => alert("Cancel")}
//           >
//             Cancel
//           </button>
//           <button type="submit" style={styles.btnSave} disabled={loading}>
//             {loading ? "SAVING..." : "Save Item"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateShoppingItem;

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import FormCardLayout from "../../components/FormCardLayout";

const CreateShoppingItem = ({
  currentUserId = "UUID-12345",
  currentOccasionId = "UUID-TET-2026",
}) => {
  const [formData, setFormData] = useState({
    user_id: currentUserId,
    name: "",
    quantity: 1,
    price: 0,
    note: "",
    category_id: null,
    budget_id: null,
    occasion_id: currentOccasionId,
  });

  const [loading, setLoading] = useState(false);

  // --- HÀM XỬ LÝ UNDO (Xóa item vừa tạo) ---
  const handleUndo = async (itemId) => {
    try {
      await axios.delete(`/api/shopping-item/${itemId}`);
      toast.info("Đã hoàn tác: Món đồ đã được gỡ bỏ khỏi danh sách.");
    } catch (err) {
      // Sử dụng 'err' để tránh lỗi "never used" và biết lỗi cụ thể
      const errMsg = err.response?.data?.message || "Không thể hoàn tác";
      toast.error(`Lỗi Undo: ${errMsg}`);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let finalValue = value;

    if (name.includes("_id") && value === "") {
      finalValue = null;
    } else if (type === "number") {
      finalValue = Number(value);
    }

    setFormData({ ...formData, [name]: finalValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.warning("Bà ơi, nhập tên món đồ đã nhé!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/shopping-item/create", formData);

      if (response.data.status === "success") {
        const newItemId = response.data.data.id;

        // HIỆN TOAST THÀNH CÔNG KÈM NÚT UNDO
toast(
      ({ closeToast }) => (
        <SuccessToast 
          closeToast={closeToast} 
          onUndo={() => handleUndo(newItemId)} 
          navigate={navigate} 
        />
      ),
      {
        position: "top-center", // Cho ra giữa phía trên
        autoClose: 8000,
        hideProgressBar: true,
        closeButton: false, // Tắt nút X mặc định cho đẹp
        style: { background: "transparent", boxShadow: "none", width: "auto" } // Xóa khung mặc định của Toastify
      }
    );
  }
} catch (err) {
    // Tương tự bà có thể làm một cái ErrorToast nếu muốn đẹp như vậy
    toast.error("Lỗi hệ thống nè bà!");
}

        // Reset form về mặc định
        setFormData({
          ...formData,
          name: "",
          quantity: 1,
          price: 0,
          note: "",
          category_id: null,
          budget_id: null,
        });
      }
    } catch (err) {
      // Sử dụng 'err' ở đây để lấy message từ Backend
      const serverMsg =
        err.response?.data?.message || "Lỗi hệ thống, thử lại sau nha!";
      toast.error(`Lỗi: ${serverMsg}`);
    } finally {
      setLoading(false); // Dừng hiệu ứng loading
    }
  };

  // Style dùng chung cho các ô input
  const inputGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-2)",
    width: "100%",
  };
  const labelStyle = {
    fontSize: "var(--fs-sm)",
    fontWeight: "var(--fw-semibold)",
    color: "var(--color-text-primary)",
  };
  const inputStyle = {
    padding: "var(--space-3)",
    border: "1px solid var(--color-border-medium)",
    borderRadius: "var(--radius-sm)",
    fontSize: "var(--fs-md)",
    backgroundColor: "var(--color-bg-main)",
    color: "var(--color-text-primary)",
    outline: "none",
    fontFamily: "inherit",
  };

  return (
    <FormCardLayout
      title="Add New Item"
      subtitle="Plan ahead for a prosperous New Year."
      submitText="SAVE ITEM"
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={() => console.log("Hủy form")}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
        }}
      >
        {/* Tên món đồ */}
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Item name *</label>
          <input
            style={inputStyle}
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Hạt dưa, bánh mứt..."
          />
        </div>

        {/* Danh mục & Số lượng */}
        <div style={{ display: "flex", gap: "var(--space-4)" }}>
          <div style={{ ...inputGroupStyle, flex: 2 }}>
            <label style={labelStyle}>Category</label>
            <select
              name="category_id"
              style={inputStyle}
              value={formData.category_id || ""}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              <option value="cat-001">Food & Drinks</option>
              <option value="cat-002">Decorations</option>
            </select>
          </div>
          <div style={{ ...inputGroupStyle, flex: 1 }}>
            <label style={labelStyle}>Qty</label>
            <input
              style={inputStyle}
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
            />
          </div>
        </div>

        {/* Ngân sách dự kiến */}
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Estimate Price (VND)</label>
          <input
            style={inputStyle}
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        {/* Dịp lễ */}
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Occasion</label>
          <input
            style={inputStyle}
            type="text"
            name="occasion_id"
            value={formData.occasion_id || ""}
            onChange={handleChange}
            placeholder="e.g. Tet 2026"
          />
        </div>

        {/* Ghi chú */}
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Note</label>
          <textarea
            style={{ ...inputStyle, height: "80px", resize: "none" }}
            name="note"
            value={formData.note}
            onChange={handleChange}
          />
        </div>
      </div>
    </FormCardLayout>
  );
};

export default CreateShoppingItem;
