import React from 'react';
import './modal.css';

interface ModalProps {
  is_open: boolean;
  on_close: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function Modal({
  is_open,
  on_close,
  title,
  children,
  footer,
}: ModalProps) {
  if (!is_open) return null;

  return (
    <div className="ui_modal_overlay" onClick={on_close}>
      <div className="ui_modal_container" onClick={(e) => e.stopPropagation()}>
        <div className="ui_modal_header">
          <h3 className="ui_modal_title">{title}</h3>
          <button className="ui_modal_close_button" onClick={on_close}>
            &times;
          </button>
        </div>
        <div className="ui_modal_body">{children}</div>
        {footer && <div className="ui_modal_footer">{footer}</div>}
      </div>
    </div>
  );
}
