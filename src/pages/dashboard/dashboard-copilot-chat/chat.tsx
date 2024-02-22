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
import {
  currentInvestigation as defaultInvestigation,
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
  setSearchInput,
}: {
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
}): React.ReactElement => {
  const navigate = useNavigate();
  const location = useLocation();
  let loading = false;
  const [, setQuery] = useState('');
  const [currentInvestigation, setCurrentInvestigation] =
    useRecoilState<InvestigationState>(defaultInvestigation);
  const [isSearching, setIsSearching] = useRecoilState<boolean>(searching);
  const updateFocus = () => {
    const input = document.querySelector('textarea');
    if (input) {
      input.focus();
    }
  };

  const submitSearch = async () => {
    // Begin chat
    loading = true;
    setIsSearching(true);

    // Navigate to chatwindow
    if (location.pathname === '/dashboard') {
      navigate('/investigations');
    }

    // Intialize chat history
    let chatHistory: object[] = [];

    const queryCopy = searchInput;
    if (
      queryCopy.toLowerCase() == 'clear chat history' ||
      queryCopy.toLowerCase() == 'clear' ||
      queryCopy.toLowerCase() == 'clear chat'
    ) {
      window.sessionStorage.setItem('chat_history', '');
      setSearchInput('');
      setQuery('');
      return;
    }
    let newData: Prompt[] = [];
    if (currentInvestigation?.prompts) {
      newData = [...currentInvestigation.prompts];
    }

    let newPrompt: Prompt = {
      id: Math.random().toString(),
      prompt: queryCopy,
      completion: 'Loading...',
    };
    newData.unshift(newPrompt);
    // Get current chat history
    const localData = window.sessionStorage.getItem('chat_history');
    if (localData != null && localData != '') {
      chatHistory = JSON.parse(localData);
      console.log(chatHistory);
    }

    // Intialize variable to send to api
    const data = {
      query: queryCopy,
      chat_history: chatHistory,
    };
    // Make API call
    const response = await fetch('api/PromptFlowAPI', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'x-functions-key': process.env.API_KEY,
      } as HeadersInit,
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const jsonResponse = await response.json();
      console.log(jsonResponse);
      // Initialize variable with response
      newPrompt = {
        id: generateGUID(),
        prompt: queryCopy,
        completion: jsonResponse.reply,
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
      loading = false;
      setIsSearching(false);
      setSearchInput('');
    } else {
      console.error('Error:', response.statusText);
    }
    setQuery('');
  };

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

  useEffect(() => {
    if (!isSearching && !loading) {
      updateFocus();
    }
  }, [isSearching, loading]);

  return (
    <div className="grid-container position-relative bottom-2">
      <div
        className={`display-flex flex-justify-center search-area ${
          location.pathname === '/'
            ? 'search-area-home'
            : 'search-area-investigation'
        }`}
      >
        <TextAreaInput
          id="search-input"
          name="search-input"
          label="Enter your search here..."
          className="search-area-input"
          autoFocus
          placeholder="Enter your search here..."
          disabled={loading || isSearching}
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
        {loading || isSearching ? (
          <img src={infinteLoop} alt="loading" className="searching" />
        ) : (
          <Button
            id="search-btn"
            className="search-input"
            onClick={handleSearch}
            disabled={loading || isSearching}
          >
            Send
          </Button>
        )}
      </div>
    </div>
  );
};
