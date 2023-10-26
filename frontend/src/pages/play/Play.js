import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { DismissibleAlert } from '../../components/DismissibleAlert';

export default function Play () {
  const n = useNavigate();
  const [err, setErr] = useState(null);
  const { pid } = useParams();

  const [status, setStatus] = useState('');
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [remain, setRemain] = useState(-1);
  const userAnswers = useRef(new Set());

  useEffect(() => {
    if (status === 'stopped') {
      return;
    }

    function check () {
      axios.get(`/play/${pid}/status`)
        .then(res => {
          if (res.data.started === false) {
            setStatus('not started');
            setErr({ closable: false, type: 'warning', text: 'Please wait for the admin to start!' });
          } else if (res.data.started === true) {
            setErr({ closable: false, type: 'primary', text: 'Game started! please make your answers!' });
            setStatus('started');
          }
        })
        .catch(err => {
          if (err?.response?.data?.error === 'Session ID is not an active session') {
            setStatus('stopped');
            setQuestion(null);
            setAnswers([]);
            setErr({ closable: false, type: 'warning', text: 'Game stopped.' });
            // go result
            n(`/result/${pid}`)
          }
        });
    }

    check();

    const interval = setInterval(check, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [status]);

  useEffect(() => {
    let interval = 0;
    if (status === 'started') {
      interval = setInterval(() => {
        axios.get(`/play/${pid}/question`)
          .then(res => {
            setQuestion(res.data.question);
          });
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [status]);

  useEffect(() => {
    if (remain === 0) {
      axios.get(`/play/${pid}/answer`)
        .then(res => {
          setAnswers(res.data.answerIds);
        });
    }
  }, [remain]);

  useEffect(() => {
    if (!question) {
      return;
    }
    const started = new Date(question.isoTimeLastQuestionStarted).getTime() / 1000;
    const end = started + question.duration;
    setRemain(Math.ceil(Math.max(0, end - Date.now() / 1000)));
  }, [question]);

  return (
    <div>
      <h3 className={'mb-4'}>Play Game</h3>
      <p>Game status: <b>{status}</b></p>

      <DismissibleAlert {...err} onClose={setErr}/>
      <br/>

      {
        !!question && <div>
          <h2>Question: {question.text}</h2>
          <hr/>
          <p><b className={'text-danger'}>Additional informations:</b></p>
          <div>Video Link: {question.url
            ? <a href={question.url} target={'_blank'}
                 rel="noreferrer">{question.url}</a>
            : 'not available'}</div>
          <div>Image: {question.thumb ? <img src={question.thumb} alt={'thumb'}/> : 'not available'}</div>
          <hr/>
          <p><b className={'text-danger'}>Time remain: {remain}</b></p>
          <hr/>
          <p><b className={'text-danger'}>Make you answers:</b></p>
          {
            question.answers.map(v => <div key={v.id} className={'form-check'}>
              <label className={'form-check-label'}>
                <input
                  disabled={remain === 0}
                  name={'q'}
                  className={'form-check-input'}
                  type={question.type === 'single' ? 'radio' : 'checkbox'}
                  onInput={e => {
                    if (question.type === 'single') {
                      userAnswers.current.clear();
                      userAnswers.current.add(v.id);
                    } else {
                      if (e.target.checked) {
                        userAnswers.current.add(v.id);
                      } else {
                        userAnswers.current.delete(v.id);
                      }
                    }
                    axios.put(`/play/${pid}/answer`, {
                      answerIds: [...userAnswers.current].filter(a =>
                        question.answers.map(v => v.id).includes(a))
                    });
                  }}
                />
                {remain === 0
                  ? (answers?.includes(v.id)
                      ? <b className={'text-success'}>{v.text} (correct)</b>
                      : <span
                      className={'text-muted'}>{v.text}</span>)
                  : v.text}
              </label>
            </div>)
          }
        </div>
      }
    </div>
  );
}
