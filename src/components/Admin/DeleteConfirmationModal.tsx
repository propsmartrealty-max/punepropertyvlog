import React from 'react';
import { TriangleAlert, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    itemName?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    itemName
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all scale-100 opacity-100">
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="bg-red-100 p-3 rounded-full">
                            <TriangleAlert className="w-6 h-6 text-red-600" />
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                    <p className="text-slate-500 mb-6">
                        {message}
                        {itemName && (
                            <span className="block mt-2 font-medium text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                "{itemName}"
                            </span>
                        )}
                    </p>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 font-semibold text-white hover:bg-red-700 shadow-lg hover:shadow-red-500/30 transition-all"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
