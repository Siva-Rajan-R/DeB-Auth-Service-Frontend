
export const AlertDialog = ({ isOpen, onCancel, onConfirm,confirmText='Confirm',title='this is your title goes',content}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      <div className="bg-white/10 p-6 rounded-2xl shadow-md w-96 border-l-2 border-r-2 border-purple-400">
        {/* Title */}
        <h2 className="text-xl font-bold text-cyan-200 mb-4">{title}</h2>

        {/* Input fields */}
        <div className="flex flex-col gap-3">
          {content}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-semibold shadow"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

