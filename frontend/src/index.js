import React from 'react';
import './index.css';
import Layout from './components/Layout.js';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import { createRoot } from 'react-dom/client';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { AdminLayout } from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import NewGame from './pages/admin/NewGame';
import Delete from './pages/admin/DeleteGame';
import EditGame from './pages/admin/EditGame';
import EditQuestion from './pages/admin/EditQuestion';
import DeleteQuestion from './pages/admin/DeleteQuestion';
import Join from './pages/play/Join';
import Play from './pages/play/Play';
import GameResult from './pages/admin/GameResult';
import Result from './pages/play/Result';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<Provider store={store}>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Home/>}/>
        <Route path={'/login'} element={<Login/>}/>
        <Route path={'/register'} element={<Register/>}/>
        <Route path="/admin" element={<AdminLayout/>}>
          <Route index element={<Navigate to="dashboard"/>}/>
          <Route path={'dashboard'} element={<Dashboard/>}/>
          <Route path={'quiz/new'} element={<NewGame/>}/>
          <Route path={'quiz/:id'} element={<EditGame/>}/>
          <Route path={'quiz/:id/delete'} element={<Delete/>}/>
          <Route path={'quiz/:id/question/new'} element={<EditQuestion/>}/>
          <Route path={'quiz/:id/question/:qid'} element={<EditQuestion/>}/>
          <Route path={'quiz/:id/question/:qid/delete'} element={<DeleteQuestion/>}/>
          <Route path={'result/:sid'} element={<GameResult/>}/>
        </Route>
        <Route path={'/join'} element={<Join/>}/>
        <Route path={'/join/:sid'} element={<Join/>}/>
        <Route path={'/play/:pid'} element={<Play/>}/>
        <Route path={'/result/:pid'} element={<Result/>}/>
      </Route>
    </Routes>
  </BrowserRouter>
</Provider>);
