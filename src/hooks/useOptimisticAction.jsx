// src/hooks/useOptimisticAction.jsx
import { useRef, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { UndoToast } from "./UndoToast";

export const useOptimisticAction = () => {
  const pendingTimers = useRef(new Map());

  // Tự động dọn dẹp các timer nếu component/context bị unmount để chống rò rỉ bộ nhớ
  useEffect(() => {
    return () => {
      pendingTimers.current.forEach((timer) => clearTimeout(timer));
      pendingTimers.current.clear();
    };
  }, []);

  const executeWithUndo = useCallback(
    ({
      actionId, // ID duy nhất cho hành động (VD: 'delete_1', 'create_temp123')
      message, // Lời nhắn trên Toast (VD: 'Đã xóa...')
      optimisticUpdate, // Hàm thực thi trên giao diện (Cập nhật UI ngay)
      rollback, // Hàm khôi phục giao diện nếu Undo hoặc API lỗi
      apiCall, // Hàm gọi API thực tế
      onSuccess, // (Tùy chọn) Hàm chạy khi API thành công (VD: Cập nhật lại ID thật)
      delay = 10000, // Mặc định 10 giây
    }) => {
      // 1. Cập nhật giao diện ngay lập tức
      optimisticUpdate();

      // 2. Xử lý khi người dùng bấm Undo
      const handleUndo = () => {
        clearTimeout(pendingTimers.current.get(actionId));
        pendingTimers.current.delete(actionId);
        rollback(); // Khôi phục lại UI
      };

      // 3. Hiện thông báo đếm ngược
      toast(<UndoToast message={message} onUndo={handleUndo} />, {
        autoClose: delay,
        closeOnClick: false,
        type: "default",
      });

      // 4. Bắt đầu đếm ngược gọi API
      const timerId = setTimeout(async () => {
        try {
          const res = await apiCall();
          if (onSuccess) onSuccess(res);
        } catch (error) {
          console.error(`Action ${actionId} failed:`, error);
          rollback(); // Trả lại giao diện nếu server báo lỗi
          toast.error("Hành động thất bại trên server. Đã khôi phục dữ liệu.");
        } finally {
          pendingTimers.current.delete(actionId);
        }
      }, delay);

      // Lưu timer lại
      pendingTimers.current.set(actionId, timerId);
    },
    [],
  );

  return { executeWithUndo };
};
