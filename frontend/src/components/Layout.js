import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import config from '../config.json';
import { useNavigate } from 'react-router';
import { actions } from '../store/slices/app';

// main entry
export default function Layout () {
  const token = useSelector(state => state.app.admin.token);
  const n = useNavigate();
  const dispatch = useDispatch();
  const [axiosCreated, setAxiosCreated] = useState(false);

  useEffect(() => {
    axios.defaults.baseURL = `http://localhost:${config.BACKEND_PORT}`;

    const ins = axios.interceptors.request.use(
      function (config) {
        return config;
      },
      function (error) {
        if (error.response.status === 403) {
          dispatch(actions.setAdmin({
            token: null,
            email: null,
          }));
          n('/');
        }
        return Promise.reject(error);
      });

    if (token) {
      axios.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
      axios.defaults.headers.Authorization = undefined;
    }

    setAxiosCreated(true);
    return () => {
      axios.interceptors.response.eject(ins);
    };
  }, [token]);

  if (!axiosCreated) {
    return null;
  }

  return (
    <main className={'container mt-5'}><Outlet/></main>
  );
}
