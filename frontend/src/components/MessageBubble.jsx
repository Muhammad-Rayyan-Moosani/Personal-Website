import { useEffect, useRef, useState } from "react";
import ContactForm from "./ContactForm";

// A message bubble that pops the contact form up in a dialog. Uses the native
// <dialog> element, so Esc, focus handling and the backdrop come for free.
export default function MessageBubble() {
  const dialogRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      dialog.querySelector("input")?.focus(); // start typing your name right away
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Clicking the dimmed backdrop (outside the pane) closes it.
  const onDialogClick = (e) => {
    if (e.target === dialogRef.current) setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className="message-bubble"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          <path d="M8 12h.01M12 12h.01M16 12h.01" />
        </svg>
        Send me a message
      </button>

      <dialog
        ref={dialogRef}
        className="message-dialog"
        aria-label="Send Rayyan a message"
        onClose={() => setOpen(false)}
        onClick={onDialogClick}
      >
        {open && (
          <div className="message-pane">
            <button type="button" className="message-close" onClick={() => setOpen(false)} aria-label="Close">
              ✕
            </button>
            <ContactForm title="Send me a message" />
          </div>
        )}
      </dialog>
    </>
  );
}
