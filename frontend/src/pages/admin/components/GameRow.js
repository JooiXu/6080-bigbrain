import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { usePrevious } from 'react-use';

export function GameRow ({ data, index, toast, refresh }) {
  const [detail, setDetail] = useState(null);
  const prevData = usePrevious(data);

  useEffect(() => {
    // console.log(prevData, data);
    if (!data || !prevData) {
      return;
    }
    if (data.active && !prevData.active) {
      toast({
        type: 'success',
        children: <>
          <div className={'mb-4'}>Game {data.id} started! Session id is {data.active}</div>
          <div>
            <button className={'btn btn-success'} onClick={() => {
              navigator.clipboard.writeText(`http://localhost:3000/join/${data.active}`)
                .then(() => {
                  toast({
                    type: 'success',
                    text: 'Link copied!'
                  });
                });
            }}>Copy Link
            </button>
          </div>
        </>
      });
    } else if (!data.active && prevData.active) {
      toast({
        type: 'warning',
        children: <>
          <div className={'mb-4'}>Game {data.id} stopped! Would you like to view the results?</div>
          <div>
            <NavLink to={`/admin/result/${prevData.active}`} className={'btn-result mx-1 btn btn-warning'}>YES</NavLink>
            <button type={'button'} onClick={() => toast(null)}
                    className={'mx-1 btn btn-outline-secondary'}>Dismiss
            </button>
          </div>
        </>
      });
    }
  }, [toast, prevData, data]);

  useEffect(() => {
    axios.get(`/admin/quiz/${data.id}`)
      .then((res) => {
        setDetail(res.data);
      });
  }, [data.id]);

  return (
    <tr>
      <td>{index}</td>
      <td>{data.name}</td>
      <td>{data.thumbnail
        ? <img style={{ width: 50, height: 50, objectFit: 'contain' }} src={data.thumbnail}
               alt={'thumb'}/>
        : null}</td>
      <td>{detail?.questions.length ?? ''}</td>
      <td>{detail?.questions?.reduce((a, b) => a + b.duration, 0) ?? ''}</td>
      <td>
        <NavLink className={'mx-1 btn btn-warning btn-sm'} to={`/admin/quiz/${data.id}`}>Edit</NavLink>
        <NavLink className={'mx-1 btn btn-outline-danger btn-sm'}
                 to={`/admin/quiz/${data.id}/delete`}>Delete</NavLink>
      </td>
      <td>
        {
          data.active
            ? <>
              <button onClick={() => {
                axios.post(`/admin/quiz/${data.id}/advance`)
                  .then(() => {
                    toast({
                      type: 'success',
                      text: `Game ${data.id} advanced!`
                    });
                    refresh()
                  });
              }} type={'button'} className={'btn-advance mx-1 btn btn-dark btn-sm'}>Advance
              </button>
              <button onClick={() => {
                axios.post(`/admin/quiz/${data.id}/end`)
                  .then(() => {
                    refresh();
                  });
              }} type={'button'} className={'btn-stop mx-1 btn btn-outline-danger btn-sm'}>Stop
              </button>
            </>
            : <button onClick={() => {
              axios.post(`/admin/quiz/${data.id}/start`)
                .then(() => {
                  refresh();
                });
            }} type={'button'} className={'btn-start mx-1 btn btn-warning btn-sm'}>Start</button>
        }

      </td>
    </tr>
  );
}
