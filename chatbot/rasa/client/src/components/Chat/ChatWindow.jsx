import React, { useState, useRef, useEffect } from 'react';
import ChatInput from './ChatInput';

const ChatWindow = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! How can I help you today?", sender: 'bot' }
    ]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (text) => {
        // Add user message
        const newUserMsg = { id: Date.now(), text, sender: 'user' };
        setMessages(prev => [...prev, newUserMsg]);

        // Simulate bot response (placeholder)
        setTimeout(() => {
            const botMsg = {
                id: Date.now() + 1,
                text: "I'm a Rasa bot (placeholder). I received: " + text,
                sender: 'bot'
            };
            setMessages(prev => [...prev, botMsg]);
        }, 1000);
    };

    return (
        <div className="rasa-chat-window">
            <div className="rasa-header">
                <div>
                    <div className="rasa-header-title">Rasa Assistant</div>
                    <div className="rasa-header-subtitle">Online</div>
                </div>
            </div>

            <div className="rasa-messages">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`rasa-message ${msg.sender}`}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <ChatInput onSendMessage={handleSendMessage} />
        </div>
    );
};

export default ChatWindow;
