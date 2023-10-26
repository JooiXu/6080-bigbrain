import React, { useEffect, useRef, useState } from 'react';
import { DismissibleAlert } from '../../components/DismissibleAlert';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import { base64Image } from '../../utils';

export default function EditGame () {
  const n = useNavigate();
  const [err, setErr] = useState('');
  const [data, setData] = useState(null);
  const { id } = useParams();
  const thumb = useRef('');

  useEffect(() => {
    axios.get(`/admin/quiz/${id}`)
      .then((res) => {
        setData(res.data);
      });
  }, [id]);

  if (!data) {
    return null;
  }

  return (
    <form onSubmit={e => {
      e.preventDefault();
      const values = Object.fromEntries(new FormData(e.target).entries());
      console.log(values);
      axios.put(`/admin/quiz/${id}`, {
        questions: data.questions,
        thumbnail: thumb.current ? thumb.current : data.thumbnail,
        ...values,
      })
        .then(() => {
          n('/admin/dashboard');
        })
        .catch(err => {
          setErr(err.response?.data?.error ?? 'Unknown error!');
        });
    }}>
      <h3 className={'mb-4'}>Edit Game</h3>
      <div className={'row mt-4'}>
        <div className={'col-md-6'}>
          <div className={'mb-2'}><b>General info</b></div>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input defaultValue={data.name} name={'name'} type="text" className="form-control" required/>
          </div>

          <div className="mb-3">
            <label className="form-label">Thumbnail</label>
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
          <div className={'mb-2'}><b>Questions</b></div>
          <div className={'mb-3'}>
            <div>
              <div className={'table-responsive'}>
                <table className={'table table-hover table-striped'}>
                  <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    data.questions.map((row, index) => <tr key={row.id}>
                      <td>{index + 1}</td>
                      <td>{row.text}</td>
                      <td>
                        <NavLink className={'mx-1 btn btn-sm btn-warning'} to={`/admin/quiz/${id}/question/${row.id}`}>Edit</NavLink>
                        <NavLink className={'mx-1 btn btn-sm btn-outline-danger'} to={`/admin/quiz/${id}/question/${row.id}/delete`}>Delete</NavLink>
                      </td>
                    </tr>)
                  }
                  </tbody>
                </table>

              </div>
            </div>
          </div>

          <div className={'mb-3'}>
            <NavLink to={`/admin/quiz/${id}/question/new`} className={'btn btn-warning'}>New Question</NavLink>
          </div>
        </div>
      </div>

      <DismissibleAlert text={err} onClose={setErr}/>

      <br/>
      <button type="submit" className="btn btn-warning btn-lg">Submit</button>
      <NavLink to={'/admin/dashboard'} className={'btn btn-link btn-lg'}>Cancel</NavLink>
    </form>
  );
}
