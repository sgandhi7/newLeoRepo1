import { Investigation, Session } from '@src/types/investigation';
import { User } from '@src/types/user';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import {
  currentInvestigation,
  currentUser,
  sessionId,
  sessions,
} from 'src/store';
import chatBot from '/img/leo.png';

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

interface MiniChatWindowProps {
  session: Session;
}

const MiniChatWindow: React.FC<MiniChatWindowProps> = ({ session }) => {
  const navigate = useNavigate();
  const [user] = useRecoilState<User | undefined>(currentUser);
  const [, setSessionId] = useRecoilState<string | undefined>(sessionId);
  const [, setCurrentInvestigation] =
    useRecoilState<Investigation>(currentInvestigation);

  const latestPrompt = session.prompts[session.prompts.length - 1];

  const handleResumeSession = () => {
    window.localStorage.setItem('chat_history', session.chatHistory);
    setCurrentInvestigation({ prompts: session.prompts });
    setSessionId(session.sessionId);
    navigate('/session');
  };

  return (
    <div className="mini-chat-window" onClick={handleResumeSession}>
      <div className="chat-header">
        <span className="session-id">{session.sessionId}</span>
      </div>
      <div className="chat-content">
        <div className="bot-message">
          <img src={chatBot} alt="Leo Logo" className="bot-avatar" />
          <p>{truncateText(latestPrompt.completion, 100)}</p>
        </div>
        <div className="user-message">
          <div className="avatar">
            {user && user.firstName?.charAt(0).toUpperCase()}
            {user && user.lastName?.charAt(0).toUpperCase()}
          </div>
          <p>{truncateText(latestPrompt.prompt, 100)}</p>
        </div>
      </div>
    </div>
  );
};

export const History: React.FC = () => {
  const [sessionsValue, setSessions] = useRecoilState<Session[] | undefined>(
    sessions,
  );
  const [user] = useRecoilState<User | undefined>(currentUser);

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user?.emailAddress) return;

      try {
        const response = await fetch('/api/fetchSessions', {
          method: 'POST',
          body: JSON.stringify({ user: user.emailAddress, action: 'pull' }),
        });
        const tempSessions = await response.json();
        const parsedSessions = tempSessions.map((session: string) => {
          const parsedSession = JSON.parse(session);
          return {
            sessionId: parsedSession.Name,
            prompts: parsedSession.Content.prompts,
            chatHistory: parsedSession.Content.chatHistory,
          };
        });
        setSessions(parsedSessions);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };

    if (sessionsValue === undefined) {
      fetchSessions();
    }
  }, [sessionsValue, setSessions, user?.emailAddress]);

  return (
    <div className="history-container">
      <h1>Conversation History</h1>
      <div className="chat-list">
        {sessionsValue?.map((session) => (
          <MiniChatWindow key={session.sessionId} session={session} />
        ))}
      </div>
    </div>
  );
};
