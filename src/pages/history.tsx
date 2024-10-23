// import { Investigation, Session } from '@src/types/investigation';
// import { User } from '@src/types/user';
// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useRecoilState } from 'recoil';
// import {
//   currentInvestigation,
//   currentUser,
//   sessionId,
//   sessions,
// } from 'src/store';
// import chatBot from '/img/leo.png';

// interface MiniChatWindowProps {
//   session: Session;
// }

// const truncateText = (text: string, maxLength: number) => {
//   return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
// };

// const MiniChatWindow: React.FC<MiniChatWindowProps> = ({ session }) => {
//   const navigate = useNavigate();
//   console.log('Session: ', session);
//   const latestPrompt = session.prompts[session.prompts.length - 1];
//   const [user] = useRecoilState<User | undefined>(currentUser);
//   const [, setSessionId] = useRecoilState<string | undefined>(sessionId);
//   const [, setCurrentInvestigation] =
//     useRecoilState<Investigation>(currentInvestigation);
//   const handleResumeSession = () => {
//     window.localStorage.setItem('chat_history', session.chatHistory);
//     setCurrentInvestigation({ prompts: session.prompts });
//     setSessionId(session.sessionId);
//     navigate('/session');
//   };

//   return (
//     <button className="mini-chat-button" onClick={handleResumeSession}>
//       <div className="mini-chat-window">
//         <div className="chat-content-question margin-bottom-2">
//           <div className="grid-row">
//             <div className="grid-col-1">
//               <div className="chat-question-avatar">
//                 <span>
//                   {user && user.firstName?.charAt(0).toUpperCase()}
//                   {user && user.lastName?.charAt(0).toUpperCase()}
//                 </span>
//               </div>
//             </div>
//             <div className="grid-col-11">
//               {truncateText(latestPrompt.prompt, 100)}
//             </div>
//           </div>
//         </div>
//         <div className="chat-content-answer margin-bottom-2">
//           <div className="grid-row">
//             <div className="grid-col-11">
//               <div className="grid-col-1">
//                 <img
//                   className="usa__logo-mark"
//                   src={chatBot}
//                   height={50}
//                   width={40}
//                   alt="Leo Logo"
//                 />
//               </div>
//               {truncateText(latestPrompt.completion, 100)}
//             </div>
//           </div>
//         </div>
//       </div>
//     </button>
//   );
// };

// export const History = (): React.ReactElement => {
//   const [sessionsValue, setSessions] = useRecoilState<Session[] | undefined>(
//     sessions,
//   );
//   const [user] = useRecoilState<User | undefined>(currentUser);

//   useEffect(() => {
//     const fetchSessions = async () => {
//       console.log('Fetching sessions');
//       const temp = [];
//       const response = await fetch('/api/fetchSessions', {
//         method: 'POST',
//         body: JSON.stringify({ user: user?.emailAddress, action: 'pull' }),
//       });
//       const tempSessions = await response.json();
//       console.log('Sessions: ', tempSessions);
//       for (const session of tempSessions) {
//         const tempNewSess = JSON.parse(session);
//         const newSess = {
//           sessionId: tempNewSess.Name,
//           prompts: tempNewSess.Content.prompts,
//           chatHistory: tempNewSess.Content.chatHistory,
//         };
//         temp.push(newSess);
//       }
//       console.log('Temp: ', temp);
//       setSessions(temp);
//     };
//     if (sessionsValue === undefined) {
//       fetchSessions();
//     } else {
//       console.log('Sessions already fetched: ', sessionsValue);
//     }
//   }, [sessionsValue, setSessions, user?.emailAddress]);

//   return (
//     <div className="history-container">
//       <h1>History</h1>
//       <div className="chat-list">
//         {sessionsValue?.map((session) => (
//           <MiniChatWindow key={session.sessionId} session={session} />
//         ))}
//       </div>
//     </div>
//   );
// };
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
