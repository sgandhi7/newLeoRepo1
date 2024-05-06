// eslint-disable-next-line prettier/prettier
import {
  Investigation as InvestigationState,
  Prompt,
} from '@src/types/investigation';
// eslint-disable-next-line prettier/prettier
import { Button, ListItem } from '@metrostar/comet-uswds';
// eslint-disable-next-line prettier/prettier
import { TextAreaInput } from '@src/components/text-area-input/textarea-input';
// eslint-disable-next-line prettier/prettier
import { // abortController as abortControllerAtom,
  abortController,
  currentInvestigation as defaultInvestigation,
  currentSearch as defaultSearch,
  searching,
} from 'src/store';
// eslint-disable-next-line prettier/prettier
// import useApi from '@src/hooks/use-api';
import { generateGUID } from '@src/utils/api';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import infinteLoop from '/img/infinteLoop.svg';

function formatConversation(
  history: Array<object>,
  query: string,
  response: {
    current_query_intent: string;
    fetched_docs: ListItem;
    reply: string;
    search_intents: string;
    output_entities: ListItem;
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
      output_entities: response.output_entities,
    },
  });
  return conversationHistory;
}

export const Search = ({
  searchInput,
  setSearchInput, // abortController, setAbortController,
}: {
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
}): React.ReactElement => {
  const navigate = useNavigate();
  const location = useLocation();
  const [, setQuery] = useState('');
  const [currentInvestigation, setCurrentInvestigation] =
    useRecoilState<InvestigationState>(defaultInvestigation);
  const [isSearching, setIsSearching] = useRecoilState<boolean>(searching);
  const [, setCurrentSearch] = useRecoilState<string>(defaultSearch);
  const [abortControllerRef, setAbortController] =
    useRecoilState<AbortController | null>(abortController);
  const [isNavigationEvent, setIsNavigationEvent] = useState(false);

  const updateFocus = () => {
    const input = document.querySelector('textarea');
    if (input) {
      input.focus();
    }
  };

  const submitSearch = async () => {
    // Cancel the previous request if it exists
    if (abortControllerRef) {
      abortControllerRef.abort();
    }

    // Create a new AbortController instance
    const newAbortController = new AbortController();
    setAbortController(newAbortController);

    // Begin chat
    setIsSearching(true);

    // Navigate to chatwindow
    if (location.pathname === '/dashboard') {
      navigate('/investigations');
    }

    // Intialize chat history
    let chatHistory: object[] = [];

    const queryCopy = searchInput;
    setCurrentSearch(searchInput);

    //Create current investigation (chat)
    let newData: Prompt[] = [];
    if (currentInvestigation?.prompts) {
      newData = [...currentInvestigation.prompts];
    }

    //New chat prompt
    let newPrompt: Prompt = {
      id: Math.random().toString(),
      prompt: queryCopy,
      completion: 'Loading...',
      sources: [],
    };

    //Add new prompt to current investigation
    newData.unshift(newPrompt);

    // Get current chat history
    const localData = window.sessionStorage.getItem('chat_history');
    if (localData != null && localData != '') {
      chatHistory = JSON.parse(localData);
    }
    console.log('localData: ', localData);
    // Intialize variable to send to api
    const data = {
      query: queryCopy,
      chat_history: chatHistory,
    };
    console.log('Data: ', data);
    // Use controller.signal for fetch request
    try {
      // Make API call
      const response = await fetch('api/PromptFlowAPI', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        } as HeadersInit,
        body: JSON.stringify(data),
        signal: newAbortController.signal,
      });

      if (response.ok) {
        const jsonResponse = await response.json();

        // Get resume sharepoint links and titles
        const getSources: Array<[string, string]> = [];
        const source = jsonResponse.fetched_docs[0]['retrieved_documents'];
        // Get sharepoint data
        if (source) {
          for (const doc of source) {
            for (const key in doc) {
              const document = doc[key];
              if (document['file type'] == 'resume') {
                const sharepointData = document.sharepoint;
                const sharepointName = document.title;
                //If sharepoint exists and is not empty
                if (sharepointName && sharepointData) {
                  getSources.push([
                    sharepointName,
                    'https://metrostarsys.sharepoint.com/:f:/r/sites/PC/ContentRepository/Resumes/' +
                      sharepointData,
                  ]);
                }
              } else {
                const jobTitle = document.title;
                getSources.push([jobTitle, '']);
              }
            }
          }
        }

        // // Map sources to response
        // const indices: number[] = [];
        // const completionParts = jsonResponse.reply.split('\n');
        // getSources.forEach((source) => {
        //   const sourceText = source[0];
        //   const sourceIndex = completionParts.findIndex((part: string) =>
        //     part.includes(sourceText),
        //   );
        //   if (sourceIndex !== -1) {
        //     indices.push(sourceIndex);
        //   }
        // });

        let reply = jsonResponse.reply;
        // Bold words related to output entities
        for (const word of jsonResponse.output_entities) {
          // Check if the word is in reply
          if (reply.includes(word) && word != '') {
            const boldWord = `**${word}**`;
            reply = reply.replace(word, boldWord); // Replace the word with the bold version
          }
        }
        // Initialize variable with response
        newPrompt = {
          id: generateGUID(),
          prompt: queryCopy,
          completion: reply,
          sources: getSources,
        };
        // Format chat history
        chatHistory = formatConversation(chatHistory, queryCopy, jsonResponse);

        // Send chat history to session storage
        window.sessionStorage.setItem(
          'chat_history',
          JSON.stringify(chatHistory),
        );

        // Update investigation (chat)
        newData[0] = newPrompt;
        updateCurrentInvestigation(newData);

        // Finished responding
        setIsSearching(false);
        setSearchInput('');
      } else {
        console.error('Error:', response.statusText);
      }
      setQuery('');
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted by user');
        } else {
          console.error('Error in fetch: ', error);
        }
      } else {
        console.error('Unknown error occurred: ', error);
      }
    } finally {
      // Cleanup
      setIsSearching(false);
      setQuery('');
    }
  };

  // // Cancel the initial search request when the component unmounts
  // useEffect(() => {
  //   return () => {
  //     if (abortController) {
  //       abortController.abort();
  //     }
  //   };
  // }, [abortController]);

  const updateCurrentInvestigation = (newData: Prompt[]) => {
    console.log('Updating current investigation');
    setCurrentInvestigation((prev) => ({
      ...prev,
      prompts: [...newData],
    }));
  };

  const handleOnChange = (event: SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    setQuery(value);
    setSearchInput(value);
  };

  const handleSearch = () => {
    submitSearch();
  };

  const clearChat = () => {
    window.sessionStorage.removeItem('chat_history');
  };

  const handleCancel = () => {
    if (abortControllerRef) {
      abortControllerRef.abort();
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (location.pathname === '/dashboard') {
      setIsNavigationEvent(true); // Set the flag to true before navigating
    } else {
      setIsNavigationEvent(false);
    }
    return () => {
      // Check if the component is unmounting due to a navigation event
      if (!isNavigationEvent && abortControllerRef) {
        abortControllerRef.abort();
      }
    };
  }, [abortControllerRef, isNavigationEvent, location.pathname]);

  useEffect(() => {
    if (!isSearching) {
      updateFocus();
    }
  }, [isSearching]);

  return (
    <div className="grid-container position-relative bottom-2">
      <div
        className={`display-flex flex-justify-center search-area ${
          location.pathname === '/'
            ? 'search-area-home'
            : 'search-area-investigation'
        }`}
      >
        <Button
          id="clear-chat-btn"
          className="search-input"
          onClick={clearChat}
        >
          New Chat
        </Button>
        <TextAreaInput
          id="search-input"
          name="search-input"
          label="Enter your search here..."
          className="search-area-input"
          autoFocus
          placeholder="Enter your search here..."
          disabled={isSearching}
          value={searchInput}
          onChange={handleOnChange}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
            }
          }}
          onKeyUp={(event) => {
            if (
              event.key === 'Enter' &&
              !event.shiftKey &&
              searchInput.trim() !== ''
            ) {
              submitSearch();
            }
          }}
        />
        {isSearching ? (
          <>
            <img src={infinteLoop} alt="Loading" className="searching" />
            <Button
              id="cancel-btn"
              className="search-input"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            id="search-btn"
            className="search-input"
            onClick={handleSearch}
            disabled={isSearching}
          >
            Send
          </Button>
        )}
      </div>
    </div>
  );
};
