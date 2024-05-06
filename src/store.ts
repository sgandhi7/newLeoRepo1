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

export {
  currentInvestigation,
  currentSearch,
  currentUser,
  searching,
  signedIn,
};
