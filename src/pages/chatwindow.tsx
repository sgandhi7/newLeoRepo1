import { Button, Icon } from '@metrostar/comet-uswds';
import Typewriter from '@src/components/text-area-input/typewriter';
import useApi from '@src/hooks/use-api';
import { Search } from '@src/pages/chat';
import {
  Investigation as InvestigationState,
  Prompt,
  Session,
} from '@src/types/investigation';
import { User } from '@src/types/user';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import {
  currentUser,
  currentInvestigation as defaultInvestigation,
  currentSearch as defaultSearch,
  searching,
  sessionId,
  sessions,
} from 'src/store';
import { v4 as uuidv4 } from 'uuid';
import chatBot from '/img/leo.png';
import lockIcon from '/img/lockIcon.svg';

export const Investigation = (): React.ReactElement => {
  const { id } = useParams();
  const { getItem, item } = useApi();
  const [prompts, setPrompts] = useState<Prompt[] | null>(null);
  const [currentInvestigation, setCurrentInvestigation] =
    useRecoilState<InvestigationState>(defaultInvestigation);
  const [isSearching] = useRecoilState<boolean>(searching);
  const [showSources, setShowSources] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState('');
  const [currentSearch] = useRecoilState<string>(defaultSearch);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [user] = useRecoilState(currentUser);
  const chatContentRef = useRef<HTMLDivElement>(null);
  const [sessId, setSessionId] = useRecoilState<string | undefined>(sessionId);
  const [, setSessions] = useRecoilState<Session[] | undefined>(sessions);
  const scrollToBottom = () => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  };

  const clearChat = () => {
    window.sessionStorage.removeItem('chat_history');
    setPrompts([]);
    setSessionId(undefined);
    setCurrentInvestigation((prev) => ({ ...prev, prompts: [] }));
  };

  const handleButtonClick = (buttonText: string) => {
    setSearchInput(buttonText);
  };

  useEffect(() => {
    if (item) {
      const newPrompts = item.prompts ? [...item.prompts] : [];
      setCurrentInvestigation({ ...item, prompts: newPrompts });
      setIsTypingComplete(false);
    }
  }, [item, setCurrentInvestigation, sessId, setSessionId]);

  useEffect(() => {
    if (id) {
      getItem(id);
    }
  }, [id, getItem]);

  useEffect(() => {
    if (sessId === undefined) {
      setSessionId(uuidv4());
    }
    const uploadSession = () => {
      console.log('Uploading Session: ', sessId);
      if (prompts && prompts.length > 0) {
        const session = JSON.stringify({
          prompts: prompts,
          chatHistory: window.sessionStorage.getItem('chat_history'),
        });
        fetch('/api/fetchSessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: user?.emailAddress,
            sessionId: sessId,
            action: 'upload',
            session: session,
          }),
        });
      }
    };
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
    if (currentInvestigation && currentInvestigation.prompts) {
      setPrompts(currentInvestigation.prompts);
    }
    if (isTypingComplete) {
      uploadSession();
      fetchSessions();
    }
  }, [
    currentInvestigation,
    prompts,
    sessId,
    user?.emailAddress,
    isTypingComplete,
    setSessionId,
    setSessions,
  ]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      scrollToBottom();
    });

    if (chatContentRef.current) {
      observer.observe(chatContentRef.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid-container">
      <div
        className="grid-row display-flex height-viewport"
        style={{ width: '140vh' }}
      >
        <div
          className="flex-align-self-start margin-x-auto margin-y-auto"
          style={{
            overflowY: 'auto',
            width: '90%',
            maxHeight: 'calc(100vh - 200px)',
          }}
          ref={chatContentRef}
        >
          <div className="chat-content">
            {isSearching && (
              <ChatMessage
                isLoading={true}
                prompt={{
                  id: 'temp-id',
                  prompt: currentSearch,
                  completion: 'Generating response...',
                  sources: [],
                  suggestions: [],
                }}
                user={user}
                isLatestMessage={true} // This will be the latest message while searching
              />
            )}
            {prompts?.map((prompt: Prompt, index: number) => (
              <ChatMessage
                key={`chat-content-${prompt.id}`}
                prompt={prompt}
                user={user}
                isTypingComplete={isTypingComplete}
                setIsTypingComplete={setIsTypingComplete}
                showSources={showSources}
                setShowSources={setShowSources}
                handleButtonClick={handleButtonClick}
                isLatestMessage={index === 0 && !isSearching} // Only the last message is latest if not searching
              />
            ))}
          </div>
        </div>
        <div className="flex-align-self-end width-full">
          <Button
            id="clear-chat-btn"
            onClick={clearChat}
            style={{
              position: 'relative',
              float: 'left',
              marginLeft: '100px',
              marginTop: '5px',
              zIndex: 2,
            }}
          >
            New Chat
          </Button>
          <Search searchInput={searchInput} setSearchInput={setSearchInput} />
          <div
            className="md:px-[60px]"
            style={{
              position: 'relative',
              bottom: '10px',
              right: '0',
              color: 'gray',
              fontSize: '0.8rem',
              textAlign: 'center',
              zIndex: 1,
            }}
          >
            <span>
              Leo can make mistakes. Please verify the information provided.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ChatMessageProps {
  prompt: Prompt;
  user?: User | undefined;
  isLoading?: boolean;
  isTypingComplete?: boolean;
  setIsTypingComplete?: (value: boolean) => void;
  showSources?: boolean;
  setShowSources?: (value: boolean) => void;
  handleButtonClick?: (text: string) => void;
  isLatestMessage: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  prompt,
  user,
  isLoading = false,
  setIsTypingComplete,
  showSources = false,
  setShowSources,
  handleButtonClick,
  isLatestMessage,
}) => {
  const [localTypingComplete, setLocalTypingComplete] = useState(false);

  return (
    <div>
      <div className="chat-content-question margin-bottom-2">
        <div className="grid-row">
          {user && (
            <div className="grid-col-1">
              <div className="avatar">
                {user && user.firstName?.charAt(0).toUpperCase()}
                {user && user.lastName?.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
          <div className="grid-col-11">{prompt.prompt}</div>
        </div>
      </div>
      <div className="chat-content-answer margin-bottom-2">
        <div className="grid-row">
          <div className="grid-col-1">
            <img
              className="usa__logo-mark"
              src={chatBot}
              height={50}
              width={40}
              alt="Leo Logo"
            />
          </div>
          <div className="grid-col-11">
            <div
              style={{
                color: 'gray',
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.9rem',
                justifyContent: 'center',
                marginTop: '-20px',
              }}
            >
              <img
                src={lockIcon}
                alt="Lock Icon"
                style={{ width: '18px', height: '18px' }}
              />
              Work content and chats cannot be seen outside your organization
            </div>
            {isLoading ? (
              <Typewriter
                sentence={prompt.completion}
                delay={0}
                index={0}
                length={1}
                sources={[]}
                onPartComplete={() => {}}
              />
            ) : (
              prompt.completion.split('\n').map((part, index) => (
                <Typewriter
                  key={index}
                  sentence={part.trim()}
                  delay={700}
                  index={index}
                  length={prompt.completion.split('\n').length}
                  sources={prompt.sources}
                  onPartComplete={() => {
                    if (index === prompt.completion.split('\n').length - 1) {
                      setLocalTypingComplete(true);
                      setIsTypingComplete && setIsTypingComplete(true);
                    }
                  }}
                />
              ))
            )}
            {prompt.sources &&
              localTypingComplete &&
              prompt.sources.length > 0 && (
                <SourcesSection
                  prompt={prompt}
                  showSources={showSources}
                  setShowSources={setShowSources || (() => {})}
                />
              )}
          </div>
          {prompt.suggestions &&
            prompt.suggestions.length > 0 &&
            localTypingComplete &&
            isLatestMessage && (
              <SuggestionsButtons
                suggestions={prompt.suggestions}
                handleButtonClick={handleButtonClick || (() => {})}
              />
            )}
        </div>
      </div>
    </div>
  );
};

interface SourcesSectionProps {
  prompt: Prompt;
  showSources?: boolean;
  setShowSources: (value: boolean) => void;
}

const SourcesSection: React.FC<SourcesSectionProps> = ({
  prompt,
  showSources,
  setShowSources,
}) => (
  <>
    <div className="grid-row">
      <div className="grid-col padding-top-3">
        <span
          className="padding-right-1"
          style={{ position: 'relative', top: '5px' }}
        >
          <Icon type="info" className="color-primary" id={''} />
        </span>
        <span>
          <Button
            id={`chat-content-sources-btn-${prompt}`}
            variant="unstyled"
            onClick={() => setShowSources(!showSources)}
            className="font-sans-3xs"
          >
            {showSources ? 'Hide' : 'Show'} Source
          </Button>
        </span>
      </div>
    </div>
    {showSources && (
      <div>
        <h2>List of Sources:</h2>
        <ul>
          {prompt.sources.map((source, index) => (
            <li key={index}>
              <a href={source[1]} target="_blank" rel="noopener noreferrer">
                {index + 1}. {source[0]}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )}
  </>
);

interface SuggestionsButtonsProps {
  suggestions: string[];
  handleButtonClick: (text: string) => void;
}

const SuggestionsButtons: React.FC<SuggestionsButtonsProps> = ({
  suggestions,
  handleButtonClick,
}) => (
  <div
    className="button-container-two"
    style={{
      margin: '.5rem',
      justifyContent: 'center',
    }}
  >
    {suggestions.slice(0, 3).map((suggestion, index) => (
      <button
        key={index}
        className="helper-button-two"
        style={{
          whiteSpace: 'pre-wrap',
          fontSize: '13px',
        }}
        onClick={() => handleButtonClick(suggestion)}
      >
        {suggestion}
      </button>
    ))}
  </div>
);
