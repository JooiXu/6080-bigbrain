import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

export default function Result () {
  const { pid } = useParams();

  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    axios.get(`/play/${pid}/results`)
      .then(res => {
        setAnswers(res.data);
      });
  }, []);

  return (
    <div>
      <h3 className={'mb-4'}>Game Finished.</h3>
      <p>Your questions results:</p>
      <ol>
        {
          answers.map((a, i) => <li key={i}>
            {a.correct ? <b className={'text-success'}>correct</b> : <b className={'text-danger'}>incorrect</b>},
            <small className={'ms-2 text-muted'}>started at</small> {new Date(a.questionStartedAt).toLocaleString()},
            <small className={'ms-2 text-muted'}>answered at</small> {new Date(a.answeredAt).toLocaleString()}
          </li>)
        }
      </ol>
      <NavLink to={'/'}>Back to Homepage</NavLink>
    </div>
  );
}
