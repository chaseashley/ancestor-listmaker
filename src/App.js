import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Main from './Main';
import Lines from './Lines';
 
class App extends Component {

  render() {
    return (      
       <BrowserRouter>
        <div>
            <Switch>
              <Route exact path="/" component={Main} />
              <Route exact path="/:id" component={Main} />
              <Route exact path="/:id/lines" component={Lines} />
              <Route component={Error}/>
           </Switch>
        </div> 
      </BrowserRouter>
    );
  }
}
 
export default App;