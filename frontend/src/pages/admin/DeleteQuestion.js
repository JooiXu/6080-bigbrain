import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router';
import { NavLink } from 'react-router-dom';

export default function DeleteQuestion () {
  const n = useNavigate();
  const [data, setData] = useState(null);
  const [question, setQuestion] = useState(null);
  const { id, qid } = useParams();

  useEffect(() => {
    axios.get(`/admin/quiz/${id}`)
      .then((res) => {
        setData(res.data);
        setQuestion(res.data.questions.find(v => v.id.toString() === qid))
      });
  }, [id]);

  return (
    <div>
      <h4 className={'mb-5'}>Are you sure to delete question [{question?.text}]?</h4>

      <button onClick={() => {
        const q = [...data.questions];
        q.splice(q.findIndex(v => v.id.toString() === qid), 1)
        axios.put(`/admin/quiz/${id}`, {
          questions: q,
          thumbnail: data.thumbnail,
          name: data.name,
        })
          .then(() => {
            n(`/admin/quiz/${id}`);
          });
      }} type="button" className="btn btn-danger btn-lg">YES, DELETE IT
      </button>
      <NavLink to={`/admin/quiz/${id}`} className={'btn btn-link btn-lg'}>Cancel</NavLink>
    </div>
  );
}
