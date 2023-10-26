import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { actions } from '../store/slices/app';

export function AdminLayout () {
  const token = useSelector(state => state.app.admin.token);
  const n = useNavigate();
  const dispatch = useDispatch();
  const admin = useSelector(state => state.app.admin);

  useEffect(() => {
    if (!token) {
      n('/login');
    }
  }, [token]);

  if (!token) {
    return null;
  } else {
    return <div>
      <h2 className={'text-danger'}><b>BigBrains Admin Dashboard</b></h2>
      <div className={'text-muted'}>Welcome, admin [{admin.email}]. <button onClick={() => {
        axios.post('/admin/auth/logout')
          .finally(() => {
            dispatch(actions.setAdmin({
              token: null,
              email: null,
            }));
          });
      }} type={'button'} className={'btn-logout btn btn-link btn-sm'}>Logout</button></div>

      <hr/>

      <div className={'mt-5'}>
        <Outlet/>
      </div>
    </div>;
  }
}
