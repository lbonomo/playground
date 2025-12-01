import React from 'react';
import { MessageCircle, X } from 'lucide-react';

const Launcher = ({ isOpen, onClick }) => {
    return (
        <button
            className="rasa-launcher"
            onClick={onClick}
            aria-label={isOpen ? "Close chat" : "Open chat"}
        >
            {isOpen ? (
                <X size={28} />
            ) : (
                <MessageCircle size={28} />
            )}
        </button>
    );
};

export default Launcher;
