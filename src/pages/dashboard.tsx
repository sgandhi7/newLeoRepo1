import { Search } from '@src/pages/chat';
import { Investigation as InvestigationState } from '@src/types/investigation';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import {
  currentInvestigation as defaultInvestigation, // abortController as abortControllerAtom,
} from '../store';

export const Dashboard = (): React.ReactElement => {
  const [, setCurrentInvestigation] =
    useRecoilState<InvestigationState>(defaultInvestigation);
  const [searchInput, setSearchInput] = useState<string>('');
  // Comment this out for local testing
  const handleButtonClick = (buttonText: string) => {
    setSearchInput(buttonText);
  };

  useEffect(() => {
    setCurrentInvestigation({});
  }, [setCurrentInvestigation]);

  return (
    <div className="grid-container">
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
                    'List employees that best fit job posting Full-Stack (.NET) Developer 5124',
                  )
                }
              >
                <b>
                  List employees that best fit job posting Full-Stack (.NET)
                  Developer 5124
                </b>
              </button>
              <button
                className="helper-button"
                style={{ whiteSpace: 'pre-wrap' }}
                onClick={() =>
                  handleButtonClick('What job posting best fits Shane Matyi')
                }
              >
                <b>What job posting best fit Shane Matyi</b>
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
