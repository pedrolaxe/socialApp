import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MainRouter from './MainRouter';
//import ScrollToTop from './ScrollToTop';

const App = () => (
  <BrowserRouter>
  <MainRouter />
    {/* <ScrollToTop>
      
    </ScrollToTop> */}
  </BrowserRouter>
);


export default App;
