import React, { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { DismissibleAlert } from '../../components/DismissibleAlert';
import { GameRow } from './components/GameRow';

export default function Dashboard () {
  const [toast, setToast] = useState(null);
  const [list, setList] = useState([]);

  const refresh = useCallback(() => {
    axios.get('/admin/quiz')
      .then(res => {
        const data = res.data.quizzes;
        setList(data);
      });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div>
      <div>
        <NavLink className="btn btn-warning" to={'/admin/quiz/new'}>New Game</NavLink>
      </div>
      <br/>
      <DismissibleAlert class={'mb-4'} onClose={() => setToast(null)} {...toast}/>

      {
        list.length > 0
          ? <div className={'table-responsive'}>
            <table className={'table'}>
              <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Thumbnail</th>
                <th>Number of Questions</th>
                <th>Time to Complete</th>
                <th>Actions</th>
                <th>Start/Stop</th>
              </tr>
              </thead>
              <tbody>
              {
                list.map((row, index) => <GameRow
                  key={row.id}
                  data={row}
                  index={index + 1}
                  toast={data => {
                    setToast(data);
                  }}
                  refresh={refresh}
                />)
              }
              </tbody>
            </table>

          </div>
          : <div className={'alert alert-warning'}>
            No games yet
          </div>
      }
    </div>
  );
}
