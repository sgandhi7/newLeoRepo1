import { Investigation as InvestigationState } from '@src/types/investigation';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import {
  currentInvestigation as defaultInvestigation, // abortController as abortControllerAtom,
} from '../store';
import { Search } from './chat';

export const Examples = (): React.ReactElement => {
  const [, setCurrentInvestigation] =
    useRecoilState<InvestigationState>(defaultInvestigation);
  const [searchInput, setSearchInput] = useState<string>('');

  const handleButtonClick = (buttonText: string) => {
    setSearchInput(buttonText);
    return <Search searchInput={searchInput} setSearchInput={setSearchInput} />;
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
            style={{ textAlign: 'center' }}
          >
            <h1 className="margin-bottom-4">Example Prompts</h1>
            <h2>
              Here are some example prompts, clicking on one will begin a chat.
            </h2>
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
                    'List employees that best fit job posting Associate Systems Engineer 4885',
                  )
                }
              >
                <b>
                  List employees that best fit job posting Associate Systems
                  Engineer 4885
                </b>
              </button>
              <button
                className="helper-button"
                style={{ whiteSpace: 'pre-wrap' }}
                onClick={() =>
                  handleButtonClick('What job posting best fit Daniel Vasquez')
                }
              >
                <b>What job posting best fit Daniel Vasquez</b>
              </button>
            </div>
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
                    'List employees that best fit job posting Associate Systems Engineer 4885',
                  )
                }
              >
                <b>
                  List employees that best fit job posting Associate Systems
                  Engineer 4885
                </b>
              </button>
              <button
                className="helper-button"
                style={{ whiteSpace: 'pre-wrap' }}
                onClick={() =>
                  handleButtonClick('What job posting best fit Daniel Vasquez')
                }
              >
                <b>What job posting best fit Daniel Vasquez</b>
              </button>
            </div>
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
                    'List employees that best fit job posting Associate Systems Engineer 4885',
                  )
                }
              >
                <b>
                  List employees that best fit job posting Associate Systems
                  Engineer 4885
                </b>
              </button>
              <button
                className="helper-button"
                style={{ whiteSpace: 'pre-wrap' }}
                onClick={() =>
                  handleButtonClick('What job posting best fit Daniel Vasquez')
                }
              >
                <b>What job posting best fit Daniel Vasquez</b>
              </button>
            </div>
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
                    'List employees that best fit job posting Associate Systems Engineer 4885',
                  )
                }
              >
                <b>
                  List employees that best fit job posting Associate Systems
                  Engineer 4885
                </b>
              </button>
              <button
                className="helper-button"
                style={{ whiteSpace: 'pre-wrap' }}
                onClick={() =>
                  handleButtonClick('What job posting best fit Daniel Vasquez')
                }
              >
                <b>What job posting best fit Daniel Vasquez</b>
              </button>
            </div>
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
                    'List employees that best fit job posting Associate Systems Engineer 4885',
                  )
                }
              >
                <b>
                  List employees that best fit job posting Associate Systems
                  Engineer 4885
                </b>
              </button>
              <button
                className="helper-button"
                style={{ whiteSpace: 'pre-wrap' }}
                onClick={() =>
                  handleButtonClick('What job posting best fit Daniel Vasquez')
                }
              >
                <b>What job posting best fit Daniel Vasquez</b>
              </button>
            </div>
            <div className="padding-top-10" />
            <div
              style={{
                position: 'relative',
                // top: '200px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 999,
              }}
            >
              <div id="investigations" className="prompt">
                <Search
                  searchInput={searchInput}
                  setSearchInput={setSearchInput}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
