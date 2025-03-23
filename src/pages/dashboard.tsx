import { Search } from '@src/pages/chat';
import {
  Investigation as InvestigationState,
  Session,
} from '@src/types/investigation';
import { User } from '@src/types/user';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import {
  currentUser,
  currentInvestigation as defaultInvestigation,
  sessionId,
  sessions,
} from '../store';

export const Dashboard = (): React.ReactElement => {
  const [, setCurrentInvestigation] =
    useRecoilState<InvestigationState>(defaultInvestigation);
  const [searchInput, setSearchInput] = useState<string>('');
  const [user] = useRecoilState<User | undefined>(currentUser);
  const [sessionsValue, setSessions] = useRecoilState<Session[] | undefined>(
    sessions,
  );
  const [, setSessionId] = useRecoilState<string | undefined>(sessionId);
  const handleButtonClick = (buttonText: string) => {
    setSearchInput(buttonText);
  };

  useEffect(() => {
    setCurrentInvestigation({});
    setSessionId(undefined);
    const fetchSessions = async () => {
      console.log('Fetching sessions');
      const temp = [];
      const response = await fetch('/api/fetchSessions', {
        method: 'POST',
        body: JSON.stringify({ user: user?.emailAddress, action: 'pull' }),
      });
      const tempSessions = await response.json();
      console.log('Sessions: ', tempSessions);
      for (const session of tempSessions) {
        const tempNewSess = JSON.parse(session);
        const newSess = {
          sessionId: tempNewSess.Name,
          prompts: tempNewSess.Content.prompts,
          chatHistory: tempNewSess.Content.chatHistory,
        };
        temp.push(newSess);
      }
      console.log('Temp: ', temp);
      setSessions(temp);
    };
    if (sessionsValue === undefined) {
      fetchSessions();
    } else {
      console.log('Sessions already fetched: ', sessions);
    }
  }, [
    sessionsValue,
    setCurrentInvestigation,
    setSessionId,
    setSessions,
    user?.emailAddress,
  ]);

  return (
    <div className="grid-container" style={{ paddingLeft: '50px' }}>
      <div className="grid-row">
        <div className="grid-col">
          <div
            className="width-100 padding-top-6"
            style={{ textAlign: 'center', marginTop: '100px' }}
          >
            <h1 className="margin-bottom-4">Let's Discover Top Talent</h1>
            <div className="button-container">
              <button
                className="helper-button"
                onClick={() =>
                  handleButtonClick(
                    'List employees that have experience with Drupal and PHP',
                  )
                }
              >
                <b>List employees that have experience with Drupal and PHP</b>
              </button>
              <button
                className="helper-button"
                style={{ whiteSpace: 'pre-wrap' }}
                onClick={() =>
                  handleButtonClick(
                    'List employees that best fit job posting SharePoint Developer 5361',
                  )
                }
              >
                <b>
                  List employees that best fit job posting SharePoint Developer
                  5361
                </b>
              </button>
              <button
                className="helper-button"
                style={{ whiteSpace: 'pre-wrap' }}
                onClick={() =>
                  handleButtonClick('What job postings best fit Jorge Vasquez')
                }
              >
                <b>What job postings best fit Jorge Vasquez</b>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          position: 'relative',
          top: '240px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 999,
        }}
      >
        <div id="investigations" className="prompt">
          <Search searchInput={searchInput} setSearchInput={setSearchInput} />
        </div>
      </div>
    </div>
  );
};
