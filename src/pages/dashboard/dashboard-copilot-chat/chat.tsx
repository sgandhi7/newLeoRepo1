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
  showDropdownMenu,
} from 'src/store';
// eslint-disable-next-line prettier/prettier
// import useApi from '@src/hooks/use-api';
// import { employees } from '@src/data/employeeData.ts';
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
  const [, setQuery] = useState('');
  const [currentInvestigation, setCurrentInvestigation] =
    useRecoilState<InvestigationState>(defaultInvestigation);
  const [isSearching, setIsSearching] = useRecoilState<boolean>(searching);
  const [, setCurrentSearch] = useRecoilState<string>(defaultSearch);
  const [abortControllerRef, setAbortController] =
    useRecoilState<AbortController | null>(abortController);
  const [isNavigationEvent, setIsNavigationEvent] = useState(false);
  // Variables and components related to Dropdown Menu
  const [showDropdown, setShowDropdown] = useRecoilState(showDropdownMenu);
  const [searchTerm, setSearchTerm] = useState(''); // Variable used to filter out matching people/emails
  const [activeTab, setActiveTab] = useState('contacts');
  const [jsonData, setJsonData] = useState([]); // Variable to store fetched JSON data from Azure Function API call
  const [peopleNames, setPeopleNames] = useState<string[]>([]); // Arrays to store people and emails
  const [peopleEmails, setPeopleEmails] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const filteredContacts = //Array containing only contacts with people OR emails that match searchTerm
    searchTerm.length > 0
      ? peopleNames.filter((_, index) => {
          // Built in function that only returns strings containing searchTerm
          const name = peopleNames[index].toLowerCase();
          const email = peopleEmails[index].toLowerCase();
          return (
            name.includes(searchTerm.toLowerCase()) ||
            email.includes(searchTerm.toLowerCase())
          );
        })
      : peopleNames;
  const filesData = ['Report.pdf', 'Presentation.pptx', 'Document.docx'];
  const [isLoading, setIsLoading] = useState(false);
  const [recentIndices, setRecentIndices] = useState<number[]>([]); // Array containing indices of recently-autofilled names

  const updateFocus = () => {
    const input = document.querySelector('textarea');
    if (input) {
      input.focus();
    }
  };

  const submitSearch = async () => {
    const response = await fetch('/.auth/me');
    const payload = await response.json();
    let user = null;
    const { clientPrincipal } = payload;
    if (clientPrincipal == null) {
      window.location.reload();
    } else {
      user = clientPrincipal.userDetails;
    }
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
    if (location.pathname === '/') {
      navigate('/investigations');
    }

    // Intialize chat history
    let chatHistory: object[] = [];

    const queryCopy = searchInput; // original query
    const queryCopyJSON = convertNamesToJSON(searchInput); // query that has names replaced with JSON objects
    setCurrentSearch(searchInput);

    //Create current investigation (chat)
    let newData: Prompt[] = [];
    if (currentInvestigation?.prompts) {
      newData = [...currentInvestigation.prompts];
    }

    //New chat prompt
    let newPrompt: Prompt = {
      id: Math.random().toString(),
      prompt: queryCopyJSON,
      completion: 'Loading...',
      sources: [],
      suggestions: [],
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
      query: queryCopyJSON,
      chat_history: chatHistory,
      user: user,
    };
    console.log('Checking Data: ', data);
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

        let reply = jsonResponse.reply;
        // Bold words related to output entities
        for (const word of jsonResponse.output_entities) {
          // Check if the word is in reply
          if (reply.includes(word) && word != '') {
            const boldWord = `**${word}**`;
            reply = reply.replace(word, boldWord); // Replace the word with the bold version
          }
        }
        console.log('Suggested Prompts:', jsonResponse.suggested_prompts);
        // Initialize variable with response
        newPrompt = {
          id: generateGUID(),
          prompt: queryCopy,
          completion: reply,
          sources: getSources,
          suggestions: jsonResponse.suggested_prompts,
        };
        console.log('Json Response: ', jsonResponse);
        // Format chat history
        chatHistory = formatConversation(
          chatHistory,
          queryCopyJSON,
          jsonResponse,
        );

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

  // On initial render, call function to fetch employee data from Azure Function API
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('api/EmployeeDataAPI', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          } as HeadersInit,
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setJsonData(data.jsonData); // Update employee data with fetched information
        setPeopleNames(data.names);
        setPeopleEmails(data.emails);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch employee data:', error);
        setError('Failed to fetch employee data:');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Variable to store html, backend logic, and functions for dropdown menu
  const DropdownMenu = () => {
    // State to manage active tab
    const [, setShowDropdown] = useRecoilState(showDropdownMenu); // Using Recoil state to toggle visibility

    const handleTabClick = (tabName: string) => {
      setActiveTab(tabName);
    };

    // Function to handle clicking on an item in the dropdown menu
    const handleItemClick = (item: string, index = 0) => {
      setSearchInput((prev) => prev.substring(0, prev.indexOf('/')) + item); // Set the search input to the clicked item
      setRecentIndices((prev) => [...prev, index]); // Cache index of name to substitute with corresponding JSON object later

      setActiveTab((prevTab) => prevTab);
      setShowDropdown(false);
    };

    const handleClose = () => {
      setShowDropdown(false); // Function to close the dropdown
    };

    // HTML of dropdown menu
    return error ? (
      // If there's an error, display the error message
      <p>Error: {error}</p>
    ) : (
      // Otherwise, display the dropdown menu
      <div className="dropdown-menu">
        <ul className="tab-list">
          {/* Tab for 'Contacts' */}
          <li
            className={activeTab === 'contacts' ? 'active' : ''} // Apply 'active' class if 'contacts' tab is active
            onClick={() => handleTabClick('contacts')} // Handle click to switch to 'contacts' tab
          >
            Contacts
          </li>
          {/* Tab for 'Files' */}
          <li
            className={activeTab === 'files' ? 'active' : ''} // Apply 'active' class if 'files' tab is active
            onClick={() => handleTabClick('files')} // Handle click to switch to 'files' tab
          >
            Files
          </li>
          {/* Close button for the dropdown */}
          <button className="close-button" onClick={handleClose}>
            &times;
          </button>
        </ul>
        <div className="tab-content">
          {/* Content for 'Contacts' tab */}
          {activeTab === 'contacts' &&
            (isLoading ? (
              // Show loading state if data is still loading
              <ul>
                <div className="contact-item">
                  <div className="contact-name">Loading ... </div>
                </div>
              </ul>
            ) : filteredContacts.length === 0 ? (
              // Show 'No matching results' if no contacts match the filter
              <ul>
                <div className="contact-item">
                  <div className="contact-name">No matching results</div>
                </div>
              </ul>
            ) : (
              // List of filtered contacts
              <ul>
                {filteredContacts.map((person) => (
                  <div className="contact-item" key={person}>
                    {/* Display contact name and handle click */}
                    <div
                      className="contact-name"
                      onClick={() =>
                        handleItemClick(person, peopleNames.indexOf(person))
                      } // Pass in index of person to make substituting with JSON object easier
                    >
                      {person}
                    </div>
                    {/* Display contact email and handle click */}
                    <div
                      className="contact-email"
                      onClick={() =>
                        handleItemClick(
                          peopleEmails[peopleNames.indexOf(person)],
                          peopleNames.indexOf(person),
                        )
                      } // Ensure email corresponds to correct person by using peopleNames.indexOf(person)
                    >
                      {peopleEmails[peopleNames.indexOf(person)]}
                    </div>
                  </div>
                ))}
              </ul>
            ))}
          {/* Content for 'Files' tab */}
          {activeTab === 'files' &&
            (isLoading ? (
              // Show loading state if data is still loading
              <ul>
                <div className="contact-item">
                  <div className="contact-name">Loading ... </div>
                </div>
              </ul>
            ) : (
              // List of files
              <ul>
                {filesData.map((file) => (
                  <li key={file} onClick={() => handleItemClick(file)}>
                    {file}
                  </li>
                ))}
              </ul>
            ))}
        </div>
      </div>
    );
  };

  const updateCurrentInvestigation = (newData: Prompt[]) => {
    console.log('Updating current investigation');
    setCurrentInvestigation((prev) => ({
      ...prev,
      prompts: [...newData],
    }));
  };

  // Function to remove initial / and any whitespace from searchTerm to facilitate matching
  const cleanInput = (input: string) => {
    const match = input.match(/[a-zA-Z].*$/);
    return match ? match[0] : '';
  };

  // Function to find and replace all autofilled names with equivalent JSON string
  const convertNamesToJSON = (input: string) => {
    let updatedPrompt = input;
    // Check if autofilled names (accessed using cached indices) are in searchInput
    recentIndices.forEach((userIndex) => {
      if (input.includes(jsonData[userIndex]['mss_name'])) {
        updatedPrompt = updatedPrompt.replace(
          jsonData[userIndex]['mss_name'], // Name
          JSON.stringify(jsonData[userIndex]), // String representation of JSON object
        );
      }
    });

    return updatedPrompt;
  };

  // Event handler triggered each time user types into textbox
  const handleOnChange = (event: SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    setQuery(value);
    setSearchInput(value);

    // Show dropdown menu if user types backslash into textbox
    setShowDropdown(value.includes('/'));
    if (value.includes('/')) {
      // Set search term to text after backslash
      setSearchTerm(cleanInput(value.substring(value.indexOf('/'))));
    }
  };

  // useEffect(() => {
  //   console.log('searchInput: ' + searchInput);
  //   console.log(jsonData);
  //   console.log(recentIndices);
  // }, [searchInput, jsonData, recentIndices]);

  const handleSearch = () => {
    submitSearch(); // Submit search when clicking on submit button
  };

  const handleCancel = () => {
    if (abortControllerRef) {
      abortControllerRef.abort();
    }
  };

  useEffect(() => {
    if (location.pathname === '/') {
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

  const [image, setImage] = useState('/img/sendbutton.png');
  function handleMouseHover(imagePath: React.SetStateAction<string>) {
    return () => {
      setImage(imagePath);
    };
  }

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
          label="Ask me anything or type / to add people, files, and more"
          className="search-area-input"
          autoFocus
          placeholder="Ask me anything or type / to add people, files, and more"
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
          <>
            <button
              type="submit"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                marginRight: '0.5rem',
                transform: 'translateX(-160%)',
              }}
              onClick={handleSearch}
              onMouseEnter={handleMouseHover('/img/sendbuttonhover.png')}
              onMouseLeave={handleMouseHover('/img/sendbutton.png')}
            >
              <img src={image} alt="Send" width={26} height={26} />
            </button>
          </>
        )}
      </div>
      {showDropdown && <DropdownMenu />}
    </div>
  );
};
