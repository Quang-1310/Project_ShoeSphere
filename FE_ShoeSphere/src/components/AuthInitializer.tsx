import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { fetchProfileMe } from '../api/loginAPI';
import type { AppDispatch, RootState } from '../redux/store/store';
import { index } from '../routes';

export const AuthInitializer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.authSlice.user);

  useEffect(() => {
    if (localStorage.getItem('accessToken') && !user) {
      dispatch(fetchProfileMe());
    }
  }, [dispatch, user]);

  return <RouterProvider router={index} />;
};
