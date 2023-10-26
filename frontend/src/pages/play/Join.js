import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { DismissibleAlert } from '../../components/DismissibleAlert';

export default function Join () {
  const n = useNavigate();
  const [err, setErr] = useState('');
  const { sid } = useParams();

  return (
    <form onSubmit={e => {
      e.preventDefault();
      const values = Object.fromEntries(new FormData(e.target).entries());
      console.log(values);
      axios.post(`/play/join/${values.sessionId}`, {
        name: values.name
      })
        .then((res) => {
          n(`/play/${res.data.playerId}`);
        })
        .catch(err => {
          setErr(err.response?.data?.error ?? 'Unknown error!');
        });
    }}>
      <h3 className={'mb-4'}>Join a Game</h3>

      <div className="mb-3">
        <label className="form-label">Game Session ID</label>
        <input defaultValue={sid} name={'sessionId'} type="text" className="form-control" required/>
      </div>

      <div className="mb-3">
        <label className="form-label">Your Name</label>
        <input name={'name'} type="text" className="form-control" required/>
      </div>
      <DismissibleAlert text={err} onClose={setErr}/>
      <br/>
      <button type="submit" className="btn btn-warning btn-lg">Join</button>
      <NavLink to={'/'} className={'btn btn-link btn-lg'}>Cancel</NavLink>
    </form>
  );
}
