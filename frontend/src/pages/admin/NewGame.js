import React, { useState } from 'react';
import { DismissibleAlert } from '../../components/DismissibleAlert';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';

export default function NewGame () {
  const n = useNavigate();
  const [err, setErr] = useState('');

  return (
    <form onSubmit={e => {
      e.preventDefault();
      const values = Object.fromEntries(new FormData(e.target).entries());
      console.log(values);
      axios.post('/admin/quiz/new', values)
        .then(() => {
          n('/admin/dashboard');
        })
        .catch(err => {
          setErr(err.response?.data?.error ?? 'Unknown error!');
        });
    }}>
      <h3 className={'mb-4'}>New Game</h3>

      <div className="mb-3">
        <label className="form-label">Name</label>
        <input name={'name'} type="text" className="form-control" required/>
      </div>
      <DismissibleAlert text={err} onClose={setErr}/>
      <br/>
      <button type="submit" className="btn btn-warning btn-lg">Submit</button>
      <NavLink to={'/admin/dashboard'} className={'btn btn-link btn-lg'}>Cancel</NavLink>
    </form>
  );
}
