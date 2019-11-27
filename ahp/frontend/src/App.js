import React, { useState, useEffect }  from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import history from './history';
import './App.scss';
import ThemeContext from 'app/context/ThemeContext';

import { ToastProvider, useToasts } from 'react-toast-notifications'

import {
  Home
} from 'app/views';

function App() {

  const [darkmode, setDarkmode] = useState(false);

  // useEffect(() => {
  //   let interval = setInterval(() => {
  //     setDarkmode(!darkmode);
  //   }, 30000);
  //   return () => clearInterval(interval);
  // }, [darkmode]);

  return (
    // style={getGradient(currentLeft, currentRight)}
    <div className={'App ' + (darkmode ? 'darkmode' : 'lightmode')} >
      <ToastProvider
        autoDismiss
        autoDismissTimeout={5000}
      >
        <ThemeContext.Provider value={{darkmode: darkmode}}>
          <Router history={history}>
            <Switch>
              <Route exact path='/:plantId' component={Home}/>
            </Switch>
          </Router>
        </ThemeContext.Provider>
      </ToastProvider>
    </div>
  );
}

export default App;
