// import { Button, Icon } from '@metrostar/comet-uswds';
import { Button, Icon } from '@metrostar/comet-uswds';
import useApi from '@src/hooks/use-api';
import { Search } from '@src/pages/dashboard/dashboard-copilot-chat/chat';
import {
  Investigation as InvestigationState,
  Prompt,
} from '@src/types/investigation';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import {
  currentInvestigation as defaultInvestigation,
  currentSearch as defaultSearch,
  searching,
} from 'src/store';
import chatBot from '/img/leo.png';
// import logomark from '/img/logo-mark.svg';
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
  const chatContentRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the bottom when content is generated
  const scrollToBottom = () => {
    const answers = document.querySelectorAll('.chat-content-answer');
    if (answers.length > 0) {
      const lastAnswer = answers[0] as HTMLElement;
      lastAnswer.scrollIntoView();
    }
  };
  // Set current chat
  useEffect(() => {
    if (item) {
      const prompts = item.prompts;
      let newPrompts: Prompt[] = [];
      if (prompts) {
        newPrompts = [...prompts];
      }

      setCurrentInvestigation({ ...item, prompts: newPrompts });
    }
  }, [item, setCurrentInvestigation]);

  useEffect(() => {
    if (id) {
      getItem(id);
    }
  }, [id, getItem, setCurrentInvestigation]);

  useEffect(() => {
    if (currentInvestigation) {
      const responsePrompts = currentInvestigation.prompts;
      if (responsePrompts) {
        setPrompts(responsePrompts);
      }
    }
  }, [currentInvestigation]);

  useEffect(() => {
    // Observe chat content for changes and scroll to the bottom when changes occur
    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((item) => {
        if (
          item.type === 'childList' &&
          item.addedNodes.length > 0 &&
          (item.target as HTMLElement).className === 'chat-content'
        ) {
          scrollToBottom();
        }
      });
    });

    // Start observing the target element
    if (chatContentRef.current) {
      observer.observe(chatContentRef.current, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }
    // Clean up by disconnecting the observer when the component unmounts
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className="grid-container">
        <div className="grid-row">
          <div className="grid-col">
            <div className="chat-content" ref={chatContentRef}>
              {isSearching ? (
                <div key={`chat-content-loading`}>
                  <div className="grid-row flex-column">
                    <div
                      key={`chat-content-question-loading`}
                      className="chat-content-question grid-col-3"
                    >
                      <div className="grid-row">
                        <div className="grid-col-11">{currentSearch}</div>
                      </div>
                    </div>
                  </div>
                  <div
                    key={`chat-content-answer-loading`}
                    className="chat-content-answer grid-col-9 "
                  >
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
                      <div className="grid-col-10">Generating response...</div>
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
              {prompts?.map((prompt: Prompt) => (
                <div key={`chat-content-${prompt.id}`}>
                  <div className="grid-row flex-column">
                    <div
                      key={`chat-content-question-${prompt.id}`}
                      className="chat-content-question grid-col-3"
                    >
                      {prompt.prompt}
                    </div>
                  </div>
                  <div
                    key={`chat-content-answer-${prompt.id}`}
                    className="chat-content-answer grid-col-9"
                  >
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
                      <div className="grid-col-10">
                        {prompt.completion}
                        {prompt.sources && prompt.sources.length > 0 ? (
                          <div
                            className="grid-row"
                            key={`chat-content-sources-${prompt}`}
                          >
                            <div className="grid-col padding-top-3">
                              <span
                                className="padding-right-1"
                                style={{ position: 'relative', top: '5px' }}
                              >
                                <Icon
                                  id={`chat-content-sources-icon-${prompt}`}
                                  type="info"
                                  className="color-primary"
                                />
                              </span>
                              <span id={`chat-content-sources-span-${prompt}`}>
                                <Button
                                  id={`chat-content-sources-btn-${prompt}`}
                                  variant="unstyled"
                                  onClick={() => {
                                    setShowSources(!showSources);
                                  }}
                                  className="font-sans-3xs"
                                >
                                  {showSources ? 'Hide' : 'Show'} Source
                                </Button>
                              </span>
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                        <div>
                          {showSources && (
                            <div>
                              <h2>List of Sources:</h2>
                              <ul>
                                {prompt.sources.map((source, index) => (
                                  <li key={index}>
                                    <a href={source[1]}>{source[0]}</a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div id="investigations" className="prompt">
        <Search searchInput={searchInput} setSearchInput={setSearchInput} />
      </div>
    </>
  );
};
