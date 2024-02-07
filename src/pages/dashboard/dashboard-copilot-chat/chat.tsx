import { ListItem } from '@metrostar/comet-uswds';
import instance from '@src/utils/axios';
import { useState } from 'react';

interface Message {
  text: string;
  fromUser: boolean;
}

function formatConversation(
  history: Array<object>,
  query: string,
  response: {
    current_query_intent: string;
    fetched_docs: ListItem;
    reply: string;
    search_intents: string;
  },
) {
  const conversationHistory = history;
  conversationHistory.push({
    inputs: {
      query: query,
    },
    outputs: {
      current_query_intent: response.current_query_intent,
      fetched_docs: response.fetched_docs,
      reply: response.reply,
      search_intents: response.search_intents,
    },
  });
  return conversationHistory;
}

const ChatComponent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const sendMessage = async () => {
    console.log('Sending message');
    let chat_history = [];
    const localData = window.sessionStorage.getItem('chat_history');
    if (localData != null && localData != '') {
      chat_history = JSON.parse(localData);
      console.log(chat_history);
    }

    if (!inputText.trim()) return;
    else if (
      inputText.toLowerCase() == 'clear chat history' ||
      inputText.toLowerCase() == 'clear' ||
      inputText.toLowerCase() == 'clear chat'
    ) {
      window.sessionStorage.setItem('chat_history', '');
      setMessages([
        ...[],
        { text: inputText, fromUser: true },
        {
          text: '||CHAT HISTORY CLEARED||',
          fromUser: false,
        },
      ]);
      setInputText('');
      return;
    } else {
      const data = {
        query: inputText,
        chat_history: chat_history,
      };
      //Send message to API endpoint
      try {
        const response = await instance.post('/score', data);
        const botReply = response.data.reply;
        chat_history = formatConversation(
          chat_history,
          inputText,
          response.data,
        );
        window.sessionStorage.setItem(
          'chat_history',
          JSON.stringify(chat_history),
        );
        setMessages([
          ...messages,
          { text: inputText, fromUser: true },
          { text: botReply, fromUser: false },
        ]);

        setInputText('');
      } catch (error) {
        console.error('Error sending message: ', error);
      }
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
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
          style={{ flex: 1, marginRight: '10px' }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;
