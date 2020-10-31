import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MainRouter from './MainRouter';
import Footer from './core/Footer';

const App = () => (
  <BrowserRouter>
    <MainRouter />

    <Footer />
  </BrowserRouter>
);


export default App;
