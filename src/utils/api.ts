import { CompletionSource } from '@src/types/investigation';

export const isMocked = (): boolean => {
  const apiUrl = process.env.TXTAI_API_URL;
  /* istanbul ignore else */
  if (apiUrl) {
    return false;
  } else {
    console.log('Running local only...');
    return true;
  }
};

export const generateGUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const getSource = (source: CompletionSource): string => {
  if (source.gdelt) return source.gdelt;
  else if (source.audio) return source.audio;
  else if (source.document) return source.document;
  else return '';
};

export const getReference = (source: CompletionSource): string => {
  if (source.reference) return ` - ${source.reference}`;
  else return '';
};

export const getScore = (source: CompletionSource): number => {
  if (source.score) {
    const num = source.score * 100;
    return Number(Math.floor(num));
  } else return 0;
};
