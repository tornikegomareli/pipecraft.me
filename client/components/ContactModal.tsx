import { useState } from "react";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  if (!open) return null;

  const send = () => {
    const body = encodeURIComponent(message + (email ? `\n\nFrom: ${email}` : ""));
    window.location.href = `mailto:gomarelidevelopment@gmail.com?subject=${encodeURIComponent("Hello from your website")}&body=${body}`;
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: overlay is a backdrop, not a focusable control
    <div
      className="contact-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="contact-modal">
        <button type="button" className="contact-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <div className="contact-head">
          <img src="/pic.jpeg" alt="" />
          <div className="contact-name">Tornike Gomareli</div>
        </div>
        <div className="contact-msg">
          Hey, thanks for visiting my website! If you have any questions or just want to say hi, feel free to send me a
          message.
        </div>
        <div className="contact-compose">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 1000))}
            placeholder="Write a message..."
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="optional@email.com (if you'd like a response)"
          />
          <div className="contact-foot">
            <span className="contact-counter">
              <b>{message.length}</b> / 1,000
            </span>
            <button type="button" className="contact-send" onClick={send} disabled={!message.trim()}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
