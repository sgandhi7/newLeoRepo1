import { act, renderHook } from '@testing-library/react';
import useAuth from '../hooks/useAuth';
import { RecoilRoot } from 'recoil';

describe('useAuth', () => {
  test('should call signIn successfully', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: RecoilRoot,
    });

    act(() => {
      result.current.signIn();
    });
    expect(result.current.signIn).toBeTruthy();
  });

  test('should call signOut successfully', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: RecoilRoot,
    });

    act(() => {
      result.current.signOut();
    });
    expect(result.current.signOut).toBeTruthy();
  });
});
