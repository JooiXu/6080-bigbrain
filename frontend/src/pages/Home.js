import React from 'react';
import { Link } from 'react-router-dom';

export default function Home () {
  return <div className="p-5 mb-4 bg-warning rounded-3">
    <div className="container-fluid py-5">
      <div className="display-5 fw-bold mb-3">Big Brain!</div>
      <div className="col-md-8 fs-4 mb-4">
        You can
        <Link to={'/login'} className={'btn btn-outline-dark mx-2'}>Login</Link>
        /
        <Link to={'/register'} className={'btn btn-outline-dark mx-2'}>Register</Link> as admin.
      </div>
      <div className="col-md-8 fs-4 mb-4">
        Or
        <Link to={'/join'} className={'btn btn-outline-dark mx-2'}>Play a game!</Link>
      </div>
    </div>
  </div>;
}
