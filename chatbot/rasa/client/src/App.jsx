import React, { useState } from 'react';
import Launcher from './components/Widget/Launcher';
import ChatWindow from './components/Chat/ChatWindow';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="rasa-widget-container">
      {isOpen && <ChatWindow />}
      <Launcher isOpen={isOpen} onClick={toggleChat} />
    </div>
  );
}

export default App;
