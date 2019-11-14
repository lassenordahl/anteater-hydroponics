import React, { useState, useEffect }  from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import history from './history';
import './App.scss';
import leaf from 'app/assets/leaf.png';

import {
  Home
} from 'app/views';

// const gradients = [
//   '#355C7D',
//   '#6C5B7B',
//   '#C06C84',
//   '#ef8e38',
//   '#659999',
//   '#91EAE4',
//   '#86A8E7',
//   // '#7F7FD5',
// ];

// const gradients = [
//   '#291e30',
//   '#654ea3',
//   '#eaafc8',
//   '#ee9ca7',
//   '#6DD5FA',
//   '#2980B9',
//   // '#f7b733',
//   '#fc4a1a',
//   '#C33764',
//   '#1D2671',
//   '#2F0743'
// ];

const gradients = [
  // '#31de84',
  '#33b572',
  '#2c89e6',
  '#eb4255',
  '#251c69',
];

function App() {

  const [currentLeft, setCurrentLeft] = useState(0);
  const [currentRight, setCurrentRight] = useState(1);

  useEffect(() => {
    const interval = setInterval(function() {
      setCurrentLeft(currentLeft < gradients.length - 1 ? currentLeft + 1 : 0);
      setCurrentRight(currentRight < gradients.length - 1 ? currentRight + 1 : 0);
    }, 10000);
    return () => clearInterval(interval);
  });

  function getGradient(left, right) {
    return {
      'backgroundColor' : gradients[left]
      // 'backgroundImage': 'linear-gradient( to bottom right, ' + gradients[left] + ', ' + gradients[right] + ')'
    }
  }

  return (
    <div className='App' style={getGradient(currentLeft, currentRight)}>
      <Router history={history}>
        <Switch>
          <Route exact path='/' component={Home}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
