import instance from '@src/utils/axios';
import { useState } from 'react';

interface Message {
  text: string;
  fromUser: boolean;
}

const ChatComponent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  const sendMessage = async () => {
    console.log('Sending message');
    if (!inputText.trim()) return;

    const data = {
      // eslint-disable-next-line prettier/prettier
      'query': inputText,
      // eslint-disable-next-line prettier/prettier
      'chat_history': [],
    };
    //Send message to API endpoint
    try {
      const response = await instance.post('score', data);
      console.log('API Response: ', response.data);
      const botReply = response.data.reply;

      setMessages([
        ...messages,
        { text: inputText, fromUser: true },
        { text: botReply, fromUser: false },
      ]);

      setInputText('');
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '400px',
        border: '1px solid black',
        padding: '10px',
        overflowY: 'auto',
      }}
    >
      <div style={{ flex: 1 }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{ textAlign: msg.fromUser ? 'right' : 'left' }}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', marginTop: '10px' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{ flex: 1, marginRight: '10px' }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;
