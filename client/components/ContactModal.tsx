import { useEffect, useRef, useState } from "react";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      messageRef.current?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const send = () => {
    const body = encodeURIComponent(message + (email ? `\n\nFrom: ${email}` : ""));
    window.location.href = `mailto:gomarelidevelopment@gmail.com?subject=${encodeURIComponent("Hello from your website")}&body=${body}`;
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: a click outside the sheet closes it; Escape is handled by the dialog itself
    <dialog
      ref={dialogRef}
      className="sheet"
      aria-label="Message Tornike"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="sheet-body">
        <button type="button" className="sheet-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 12 12" aria-hidden="true">
            <path d="M2 2l8 8M10 2l-8 8" />
          </svg>
        </button>
        <div className="contact-head">
          <img src="/avatar.jpg" alt="" />
          <span>Tornike Gomareli</span>
        </div>
        <p className="bubble">
          Hey, thanks for visiting my website! If you have any questions or just want to say hi, feel free to send me a
          message.
        </p>
        <textarea
          ref={messageRef}
          className="field"
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, 1000))}
          placeholder="Message"
          rows={4}
        />
        <input
          type="email"
          className="field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email (optional)"
        />
        <div className="contact-foot">
          <span className="counter">{message.length} / 1,000</span>
          <button type="button" className="send" onClick={send} disabled={!message.trim()}>
            Send
          </button>
        </div>
      </div>
    </dialog>
  );
}
