import React from 'react';

export const Faqs = (): React.ReactElement => {
  return (
    <div className="grid-container" style={{ textAlign: 'center' }}>
      <div className="grid-row">
        <div className="grid-col">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <h1
              style={{
                width: '50%',
                position: 'relative',
                textAlign: 'center',
              }}
            >
              Frequently <span style={{ color: '#18aee4' }}>Asked </span>
              Questions
              {/* <span style={{ color: '#18aee4' }}>Questions</span>{' '} */}
            </h1>
          </div>
        </div>
      </div>
      <div className="grid-row-2">
        <div className="grid-col-11 margin-left--20 font-size-10px">
          <h1>What is Leo?</h1>
        </div>
      </div>
    </div>
  );
};
