import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

export default function GameResult () {
  const [question, setQuestion] = useState(null);
  const [result, setResult] = useState([]);
  const { sid } = useParams();
  const [top5, setTop5] = useState([]);
  const [correctPct, setCorrectPct] = useState([]);
  const [answerTime, setAnswerTime] = useState([]);

  useEffect(() => {
    Promise.all([
      axios.get(`/admin/session/${sid}/status`),
      axios.get(`/admin/session/${sid}/results`)
    ]).then(res => {
      setQuestion(res[0].data.results);
      setResult(res[1].data.results);
    });
  }, [sid]);

  useEffect(() => {
    const top = [];
    for (const { name, answers } of result) {
      let score = 0;
      for (let i = 0; i < answers.length; ++i) {
        const q = question.questions[i];
        if (answers[i].correct && q) {
          score += q.points;
        }
      }
      top.push({
        name,
        score
      });
    }
    top.sort((a, b) => b.score - a.score)
    top.length = Math.min(top.length, 5)
    setTop5(top);
  }, [result]);

  useEffect(() => {
    if (!question) {
      return;
    }
    const pcts = question.questions.map(v => ({ total: 0, correct: 0 }));
    const ansTime = question.questions.map(v => ({ total: 0, time: 0 }));
    for (const { answers } of result) {
      for (let i = 0; i < answers.length; ++i) {
        // pct
        pcts[i].total += 1;
        pcts[i].correct += answers[i].correct ? 1 : 0;
        // time
        ansTime[i].total += 1;
        if (answers[i].questionStartedAt && answers[i].answeredAt) {
          const startAt = new Date(answers[i].questionStartedAt).getTime();
          const answeredAt = new Date(answers[i].answeredAt).getTime();
          ansTime[i].time += (answeredAt - startAt)
        }
      }
    }

    setCorrectPct(pcts.map(v => v.correct / v.total * 100));
    setAnswerTime(ansTime.map(v => v.time / 1000 / v.total));
  }, [result, question]);

  if (!question) {
    return null;
  }
  return (
    <div>
      <NavLink to={'/admin/dashboard'} className={'btn btn-warning'}>Back to Dashboard</NavLink>
      <div className={'text-danger my-3'}><b>All Questions:</b></div>
      <ol>
        {
          question.questions.map((v, i) => <li key={i}>{v.text} - <small className={'text-muted'}>{v.points} pts</small></li>)
        }
      </ol>
      <div className={'text-danger my-3'}><b>Top 5 Users and Their Scores</b></div>
      {
        result.length > 0
          ? <div className={'table-responsive'}>
            <table className={'table'}>
              <thead>
              <tr>
                <th>#</th>
                <th>User Name</th>
                <th>Total Score</th>
              </tr>
              </thead>
              <tbody>
              {
                top5.map((v, i) => <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{v.name}</td>
                  <td>{v.score}</td>
                </tr>)
              }
              </tbody>
            </table>

          </div>
          : <div className={'alert alert-warning'}>
            No records yet.
          </div>
      }
      <div className={'text-danger my-3'}><b>Questions Correct Percentage:</b></div>
      <div>
        <Bar options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              display: true,
            },
            title: {
              display: false,
            },
          },
        }} data={{
          labels: question.questions.map((v, i) => `question ${i + 1}`),
          datasets: [
            {
              label: 'Percentage',
              data: correctPct,
              backgroundColor: '#ffc107',
            },
          ],
        }} />
      </div>

      <div className={'text-danger my-3'}><b>Questions Avg Answer Time:</b></div>
      <div>
        <Line options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              display: true,
            },
            title: {
              display: false,
            },
          },
        }} data={{
          labels: question.questions.map((v, i) => `question ${i + 1}`),
          datasets: [
            {
              label: 'Time (seconds)',
              data: answerTime,
              backgroundColor: '#ffc107',
            },
          ],
        }} />
      </div>
    </div>
  );
}
