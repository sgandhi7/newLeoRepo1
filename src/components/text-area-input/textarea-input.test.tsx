// import { fireEvent, render } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import { TextAreaInput } from './textarea-input'; // Path to your component

// describe('TextAreaInput', () => {
//   test('calls onChange handler when typing', () => {
//     const handleChange = jest.fn();
//     const handleKeyUp = jest.fn();
//     const handleKeyDown = jest.fn();
//     const { getByLabelText } = render(
//       <TextAreaInput
//         id="test"
//         label="Test"
//         value=""
//         onChange={handleChange}
//         onKeyUp={handleKeyUp}
//         onKeyDown={handleKeyDown}
//       />,
//     );

//     const textarea = getByLabelText('Test');
//     userEvent.type(textarea, 'Horizon Hunt');

//     expect(handleChange).toHaveBeenCalled; // "Horizon Hunt" is 12 characters
//   });

//   test('calls onKeyUp handler when key is released', () => {
//     const handleChange = jest.fn();
//     const handleKeyUp = jest.fn();
//     const handleKeyDown = jest.fn();
//     const { getByLabelText } = render(
//       <TextAreaInput
//         id="test"
//         label="Test"
//         value=""
//         onChange={handleChange}
//         onKeyUp={handleKeyUp}
//         onKeyDown={handleKeyDown}
//       />,
//     );

//     const textarea = getByLabelText('Test');
//     fireEvent.keyUp(textarea, { key: 'Enter', code: 'Enter' });

//     expect(handleKeyUp).toHaveBeenCalledTimes(1);
//   });
// });
