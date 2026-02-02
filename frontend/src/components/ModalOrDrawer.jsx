import { useEffect, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';

export function ModalOrDrawer({ isOpen, onClose, title, children }) {
  const titleId = useId();
  
  // Handle ESC key
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  if (typeof document === 'undefined') return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal/Drawer content */}
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 pointer-events-none">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="glass-dark rounded-t-3xl md:rounded-3xl w-full max-w-lg max-h-[80vh] overflow-hidden pointer-events-auto flex flex-col animate-in slide-in-from-bottom duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - NO X BUTTON */}
          <div className="p-6 pb-4 border-b border-white/10">
            <h3 id={titleId} className="text-xl md:text-2xl font-bold text-white">{title}</h3>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-grow">
            {children}
          </div>

          {/* Footer with Close button */}
          <div className="p-6 pt-4 border-t border-white/10">
            <button
              onClick={onClose}
              className="btn-secondary w-full"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </>
    , document.body
  );
}
