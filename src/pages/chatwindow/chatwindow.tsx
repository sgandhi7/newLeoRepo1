// import { Button, Icon } from '@metrostar/comet-uswds';
import { Button, Icon } from '@metrostar/comet-uswds';
import Typewriter from '@src/components/text-area-input/typewriter';
import useApi from '@src/hooks/use-api';
import { Search } from '@src/pages/dashboard/dashboard-copilot-chat/chat';
import {
  Investigation as InvestigationState,
  Prompt,
} from '@src/types/investigation';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { useRecoilState } from 'recoil';
import {
  // abortController as abortControllerAtom,
  currentInvestigation as defaultInvestigation,
  currentSearch as defaultSearch,
  searching,
} from 'src/store';
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
  // const [abortController, setAbortController] =
  //   useRecoilState(abortControllerAtom);
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

  // useEffect(() => {
  //   // Ensure an AbortController is always available
  //   if (!abortController) {
  //     const newController = new AbortController();
  //     setAbortController(newController);
  //   }
  // }, [abortController, setAbortController]);

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
            <div
              className="chat-content"
              ref={chatContentRef}
              style={{
                bottom: '50px',
              }}
            >
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
                      <div className="grid-col-10">
                        <TypeAnimation
                          sequence={['Generating response...']}
                          speed={50}
                        />
                      </div>
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
                          Work content and chats cannot be seen outside your
                          organization
                        </div>
                        {/* Split for source indicies */}
                        {prompt.completion.split('\n').map((part, index) => (
                          <Typewriter
                            sentence={part.trim()}
                            delay={700}
                            index={index}
                            length={prompt.completion.split('\n').length}
                            sources={prompt.sources}
                          />
                        ))}
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
                                    <a href={source[1]}>
                                      {index + 1}. {source[0]}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '0',
                          right: '0',
                          color: 'gray',
                          fontSize: '0.8rem',
                          padding: '5px',
                        }}
                      >
                        AI generated content may be incorrect
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
        <Search
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          // abortController={abortController}
          // setAbortController={setAbortController}
        />
      </div>
    </>
  );
};
