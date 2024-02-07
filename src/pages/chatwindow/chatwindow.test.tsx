// import { investigationData } from '@src/data/investigation';
// import { act, render } from '@testing-library/react';
// import { AuthProvider } from 'react-oidc-context';
// import { BrowserRouter } from 'react-router-dom';
// import { RecoilRoot } from 'recoil';
// import * as useApi from '@src/hooks/use-api';
// import { Investigation } from '/investigation';

// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   useParams: () => ({
//     id: '1',
//   }),
// }));

// describe('Investigation', () => {
//   const componentWrapper = (
//     <AuthProvider>
//       <RecoilRoot>
//         <BrowserRouter>
//           <Investigation />
//         </BrowserRouter>
//       </RecoilRoot>
//     </AuthProvider>
//   );

//   test('should render successfully', async () => {
//     const { baseElement } = render(componentWrapper);
//     await act(async () => {
//       expect(baseElement).toBeTruthy();
//     });
//   });

//   test('renders with no data', async () => {
//     jest.spyOn(useApi, 'default').mockReturnValue({
//       item: undefined,
//       items: undefined,
//       loading: true,
//       completions: [],
//       error: '',
//       search: jest.fn(),
//       getItem: jest.fn(),
//       getItems: jest.fn(),
//       deleteItem: jest.fn(),
//     });
//     const { baseElement } = render(componentWrapper);
//     await act(async () => {
//       expect(baseElement).toBeTruthy();
//     });
//   });

//   test('renders with mocked data and no prompts', async () => {
//     jest.spyOn(useApi, 'default').mockReturnValue({
//       item: investigationData[0],
//       items: undefined,
//       loading: false,
//       completions: [],
//       error: '',
//       search: jest.fn(),
//       getItem: jest.fn(),
//       getItems: jest.fn(),
//       deleteItem: jest.fn(),
//     });
//     const { baseElement } = render(componentWrapper);
//     await act(async () => {
//       expect(baseElement).toBeTruthy();
//       expect(baseElement.querySelector('.chat-content')).toBeTruthy();
//     });
//   });

//   test('renders with mocked data and prompts', async () => {
//     jest.spyOn(useApi, 'default').mockReturnValue({
//       item: investigationData[2],
//       items: undefined,
//       loading: false,
//       completions: [],
//       error: '',
//       search: jest.fn(),
//       getItem: jest.fn(),
//       getItems: jest.fn(),
//       deleteItem: jest.fn(),
//     });
//     const { baseElement } = render(componentWrapper);
//     await act(async () => {
//       expect(baseElement).toBeTruthy();
//       expect(baseElement.querySelectorAll('.chat-content-answer')).toHaveLength(
//         3,
//       );
//     });
//   });

//   test('renders with mocked data while loading', async () => {
//     jest.spyOn(useApi, 'default').mockReturnValue({
//       item: investigationData[2],
//       items: undefined,
//       loading: true,
//       completions: [],
//       error: '',
//       search: jest.fn(),
//       getItem: jest.fn(),
//       getItems: jest.fn(),
//       deleteItem: jest.fn(),
//     });
//     const { baseElement } = render(componentWrapper);
//     await act(async () => {
//       expect(baseElement).toBeTruthy();
//       expect(baseElement.querySelectorAll('.chat-content-answer')).toHaveLength(
//         3,
//       );
//     });
//   });

//   test('renders with mocked data and prompts and sources', async () => {
//     jest.spyOn(useApi, 'default').mockReturnValue({
//       item: investigationData[2],
//       items: undefined,
//       loading: false,
//       completions: [],
//       error: '',
//       search: jest.fn(),
//       getItem: jest.fn(),
//       getItems: jest.fn(),
//       deleteItem: jest.fn(),
//     });
//     const { baseElement } = render(componentWrapper);
//     await act(async () => {
//       expect(baseElement).toBeTruthy();
//       expect(baseElement.querySelectorAll('.chat-content-answer')).toHaveLength(
//         3,
//       );
//     });
//     const button = baseElement.querySelectorAll(
//       '.usa-button--unstyled',
//     )[0] as HTMLButtonElement;
//     await act(async () => {
//       button.click();
//     });
//   });
// });
