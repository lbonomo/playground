import React, { useState } from 'react';
import { Send } from 'lucide-react';

const ChatInput = ({ onSendMessage }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <form className="rasa-input-area" onSubmit={handleSubmit}>
            <input
                type="text"
                className="rasa-input"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button
                type="submit"
                className="rasa-send-btn"
                disabled={!message.trim()}
                aria-label="Send message"
            >
                <Send size={20} />
            </button>
        </form>
    );
};

export default ChatInput;
