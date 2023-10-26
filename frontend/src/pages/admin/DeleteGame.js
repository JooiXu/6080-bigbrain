import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router';
import { NavLink } from 'react-router-dom';

export default function DeleteGame () {
  const n = useNavigate();
  const [data, setData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`/admin/quiz/${id}`)
      .then((res) => {
        setData(res.data);
      });
  }, [id]);

  return (
    <div>
      <h4 className={'mb-5'}>Are you sure to delete game [{data?.name}]?</h4>

      <button onClick={() => {
        axios.delete(`/admin/quiz/${id}`)
          .then(() => {
            n('/admin/dashboard');
          });
      }} type="button" className="btn btn-danger btn-lg">YES, DELETE IT
      </button>
      <NavLink to={'/admin/dashboard'} className={'btn btn-link btn-lg'}>Cancel</NavLink>
    </div>
  );
}
