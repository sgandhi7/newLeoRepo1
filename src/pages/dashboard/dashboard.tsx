// import { Spinner } from '@metrostar/comet-extras';
// import { Card, CardBody } from '@metrostar/comet-uswds';
// import { useQuery } from '@tanstack/react-query';
// import ErrorNotification from '../../components/error-notification/error-notification';
// import useAuth from '../../hooks/use-auth';
// import { DashboardBarChart } from './dashboard-bar-chart/dashboard-bar-chart';
// import { DashboardPieChart } from './dashboard-pie-chart/dashboard-pie-chart';
// import ChatComponent from './dashboard-copilot-chat/chat';
// import { DashboardTable } from './dashboard-table/dashboard-table';
// import axios from '@src/utils/axios';
import { Search } from '@src/pages/dashboard/dashboard-copilot-chat/chat';
import { Investigation as InvestigationState } from '@src/types/investigation';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentInvestigation as defaultInvestigation } from '../../store';

export const Dashboard = (): React.ReactElement => {
  const [, setCurrentInvestigation] =
    useRecoilState<InvestigationState>(defaultInvestigation);
  const [searchInput, setSearchInput] = useState<string>('');

  const handleButtonClick = (buttonText: string) => {
    setSearchInput(buttonText);
  };

  useEffect(() => {
    setCurrentInvestigation({});
  }, [setCurrentInvestigation]);

  return (
    <div className="grid-container">
      {/* <div className="grid-row padding-bottom-2">
        <div className="grid-col">
          <h1>Let's Discover Top Talent</h1>
        </div>
      </div> */}
      {/* {error && (
        <div className="grid-row padding-bottom-2">
          <div className="grid-col">
            <ErrorNotification error={error.message} />
          </div>
        </div>
      )} */}
      <div className="grid-row">
        <div className="grid-col">
          <div
            className="width-100 padding-top-6"
            style={{ textAlign: 'center' }}
          >
            <h1 className="margin-bottom-4">Let's Discover Top Talent</h1>
            <div className="button-container">
              {/* <p className="helper-text">
                Don't know where to start? Try a helper prompt.
              </p> */}
              <button
                className="helper-button"
                onClick={() =>
                  handleButtonClick(
                    'Given Jorge Vasquez’s skills, what job posting best fits them?',
                  )
                }
              >
                Given Jorge Vasquez's skills, what job postings best fit them?
              </button>
              <button
                className="helper-button"
                style={{ whiteSpace: 'pre-wrap' }}
                onClick={() =>
                  handleButtonClick(
                    'List employees that have experience with Drupal and PHP',
                  )
                }
              >
                List employees that have experience with Drupal and PHP
              </button>
              <button
                className="helper-button"
                style={{ whiteSpace: 'pre-wrap' }}
                onClick={() =>
                  handleButtonClick(
                    'List the top 3 employees that have full-stack experience',
                  )
                }
              >
                List the top 3 employees that have full-stack experience
              </button>
            </div>
          </div>
        </div>
        {/* <div className="tablet:grid-col-6">
          <Card id="pie-chart-card">
            <CardBody>
              <h2>Spacecraft Affiliation</h2>
              <DashboardPieChart items={items} />
            </CardBody>
          </Card>
        </div> */}
        {/* <div className="tablet:grid-col-6">
          <Card id="pie-bar-card">
            <CardBody>
              <h2>Spacecraft Appearances</h2>
              <DashboardBarChart items={items} />
            </CardBody>
          </Card>
        </div> */}
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
      {/* <div className="grid-row">
        <div className="grid-col">
          {isLoading ? (
            <Spinner id="spinner" type="small" loadingText="Loading..." />
          ) : (
            <DashboardTable items={items} />
          )}
        </div>
      </div> */}
    </div>
  );
};
