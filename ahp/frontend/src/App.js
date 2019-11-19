import React, { useState, useEffect }  from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import history from './history';
import './App.scss';
import ThemeContext from 'app/context/ThemeContext';

import {
  Home
} from 'app/views';

function App() {

  const [darkmode, setDarkmode] = useState(true);

  useEffect(() => {
    let interval = setInterval(() => {
      setDarkmode(!darkmode);
    }, 30000);
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
