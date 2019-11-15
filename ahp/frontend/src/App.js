import React, { useState, useEffect }  from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import history from './history';
import './App.scss';
import leaf from 'app/assets/leaf.png';
import ThemeContext from 'app/context/ThemeContext';

import {
  Home
} from 'app/views';

const gradients = [
  // '#31de84',
  '#33b572',
  '#2c89e6',
  '#eb4255',
  '#251c69',
];

var darkmode = true;

function App() {

  useEffect(() => {
    let interval = setInterval(() => {
      darkmode = !darkmode;
    })
    return () => clearInterval(interval);
  }, [darkmode]);

  return (
    // style={getGradient(currentLeft, currentRight)}
    <div className={'App ' + (darkmode ? 'darkmode' : 'lightmode')} >
      <ThemeContext.Provider value={{darkmode: darkmode}}>
        <Router history={history}>
          <Switch>
            <Route exact path='/:plantId' component={Home}/>
          </Switch>
        </Router>
      </ThemeContext.Provider>
    </div>
  );
}

export default App;
