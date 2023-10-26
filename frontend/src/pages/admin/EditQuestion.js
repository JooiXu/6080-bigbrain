import React, { useEffect, useRef, useState } from 'react';
import { DismissibleAlert } from '../../components/DismissibleAlert';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import { base64Image } from '../../utils';

export default function EditQuestion () {
  const n = useNavigate();
  const [err, setErr] = useState('');
  const [data, setData] = useState(null);
  const { id, qid } = useParams();
  const thumb = useRef('');
  const [question, setQuestion] = useState(null);

  const [answers, setAnswers] = useState([
    { id: Date.now(), text: '', right: false },
    { id: Date.now() + 1, text: '', right: false },
  ]);

  function updateAnswer (index, data) {
    const a = [...answers];
    a[index] = {
      ...a[index],
      ...data
    };
    setAnswers(a);
  }

  useEffect(() => {
    axios.get(`/admin/quiz/${id}`)
      .then((res) => {
        setData(res.data);
        const q = res.data.questions.find(v => v.id.toString() === qid)
        setQuestion(q)
        setAnswers(q.answers)
      });
  }, [id]);

  if (!data) {
    return null;
  }

  return (
    <form onSubmit={e => {
      e.preventDefault();
      const values = Object.fromEntries(new FormData(e.target).entries());
      console.log(values, answers);
      const newQuestion = {
        ...values,
        id: Date.now(),
        duration: Number(values.duration),
        points: Number(values.points),
        answers,
        thumb: qid && !thumb.current ? question.thumb : thumb.current
      };
      const questions = [...data.questions];
      if (!qid) {
        questions.push(newQuestion)
      } else {
        const index = questions.findIndex(v => v.id.toString() === qid);
        questions[index] = newQuestion
      }
      axios.put(`/admin/quiz/${id}`, {
        name: data.name,
        thumbnail: data.thumbnail,
        questions,
      })
        .then(() => {
          n(`/admin/quiz/${id}`);
        })
        .catch(err => {
          setErr(err.response?.data?.error ?? 'Unknown error!');
        });
    }}>
      <h4 className={'mb-4'}>{qid ? 'Edit' : 'New'} Question</h4>

      <div className={'row mt-4'}>
        <div className={'col-md-6'}>
          <div className={'mb-2 text-danger'}><b>General info</b></div>
          <div className="mb-3">
            <label className="form-label">Question</label>
            <input defaultValue={question?.text ?? ''} name={'text'} type="text" className="form-control" required/>
          </div>

          <div className="mb-3">
            <label className="form-label">Question Type</label>
            <br/>
            <div className="form-check form-check-inline">
              <label className="form-check-label">
                <input defaultChecked={question?.type === 'single'} className="form-check-input" type="radio" name="type" value="single" required/>
                Single choice
              </label>
            </div>
            <div className="form-check form-check-inline">
              <label className="form-check-label">
                <input defaultChecked={question?.type === 'multi'} className="form-check-input" type="radio" name="type" value="multi" required/>
                Multiple choice
              </label>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Time limit</label>
            <input defaultValue={question?.duration ?? ''} name={'duration'} type="number" step={'1'} min={0} className="form-control" required/>
          </div>

          <div className="mb-3">
            <label className="form-label">Points worth</label>
            <input defaultValue={question?.points ?? ''} name={'points'} type="number" step={'1'} min={0} className="form-control" required/>
          </div>

          <div className="mb-3">
            <label className="form-label">Youtube Video Url (optional)</label>
            <input defaultValue={question?.url ?? ''} name={'url'} type="url" className="form-control"/>
          </div>

          <div className="mb-3">
            <label className="form-label">Photo (optional)</label>
            <input onInput={(e) => {
              const file = e.target.files[0];
              if (file) {
                base64Image(file).then((res) => {
                  console.log(res);
                  thumb.current = res;
                });
              } else {
                thumb.current = '';
              }
            }} type="file" accept={'image/*'} className="form-control"/>
          </div>
        </div>
        <div className={'col-md-6'}>
          <div className={'mb-2 text-danger'}><b>Answers</b></div>

          {
            answers.map((answer, index) => <div className={'mb-3'} key={answer.id}>
              <label className="form-label">Answer {index + 1}</label>
              <div className="input-group">
                <div className="input-group-text">
                  Is correct?
                  <input defaultChecked={answer.right} onInput={e => {
                    updateAnswer(index, {
                      right: e.target.checked
                    });
                  }} className="ms-2 form-check-input mt-0" type="checkbox"/>
                </div>
                <input defaultValue={answer.text} onInput={e => {
                  updateAnswer(index, {
                    text: e.target.value
                  });
                }} type="text" className="form-control"/>
                <button disabled={answers.length <= 2} onClick={() => {
                  const a = [...answers];
                  a.splice(index, 1);
                  setAnswers(a);
                }} className="btn btn-outline-danger" type="button">Delete
                </button>
              </div>
            </div>)
          }
          <div className={'mb-3'}>
            {
              answers.length < 6 && <button onClick={() => {
                setAnswers(prevState => {
                  return [
                    ...prevState,
                    {
                      id: Date.now(),
                      text: '',
                      right: false
                    }
                  ];
                });
              }} type={'button'} className={'btn btn-warning'}>Add Answer...
              </button>
            }
          </div>
        </div>
      </div>

      <DismissibleAlert text={err} onClose={setErr}/>

      <br/>
      <button type="submit" className="btn btn-warning btn-lg">Submit</button>
      <NavLink to={`/admin/quiz/${id}`} className={'btn btn-link btn-lg'}>Cancel</NavLink>
    </form>
  );
}
