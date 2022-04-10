import React from 'react';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
// css //
import  "../node_modules/bootstrap/dist/css/bootstrap.css";
import  "./App.css";
// Pages //

import Home from "./pages/Home.js";
import Create from "./components/CreateTask.js";

class App extends React.Component {
  render() {
    return (
          <Router>         
            <Switch>
              <Route exact path='/' component={Home}/>
              <Route  path='/create' component={Create}/>
          </Switch>        
            
          </Router>
    );
  }
}

export default App;