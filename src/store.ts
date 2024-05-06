// import { User } from '@src/types/user';
import { atom } from 'recoil';
import { Investigation } from './types/investigation';

const signedIn = atom({
  key: 'signedIn',
  default: false,
});

const currentUser = atom({
  key: 'currentUser',
  default: '',
});

const currentInvestigation = atom<Investigation>({
  key: 'currentInvestigation',
  default: {},
});

const searching = atom({
  key: 'searching',
  default: false,
});

const currentSearch = atom({
  key: 'currentSearch',
  default: '',
});

// Create a new atom to manage the AbortController
const abortController = atom<AbortController | null>({
  key: 'abortController',
  default: null,
  // Recoil does not automatically reset non-serializable objects like AbortController,
  // so it is typically set to null initially and created in components as needed.
});

export {
  abortController,
  currentInvestigation,
  currentSearch,
  currentUser,
  searching,
  signedIn,
};
