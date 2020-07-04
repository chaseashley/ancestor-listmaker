import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Main from './Main';
import Lines from './Lines';
import db from './db';

const NoMatchPage = () => {
    return (
      <h3>404 - Not found</h3>
    );
  };
 
class App extends Component {

    render() {

        const startingState = {
            descendant: '',
            lastDescendant: '',
            category: null,
            lastCategory: null,
            locationText: '',
            lastLocationText: '',
            categoryText: '',
            lastCategoryText: '',
            generations: null,
            lastGenerations: null,
            ahnentafel: false,
            lastAhnentafel: false,
            fullname: false,
            multiples: false,
            descendantJson: null,
            ancestorList: null,
            matchingAncestorsList: null,
            processingStatus: null,
            lastSort: null,
            ancestorLists: [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
        }
        db.table('main').put(JSON.stringify(startingState),0); //This is to clean out the storage at the start of a session
        
        localStorage.setItem('scrollPosition', 0);

        return (      
            <BrowserRouter>
            <div>
                <Switch>
                    <Route path="/apps/ashley1950/listmaker/lines" component={Lines} />
                    <Route path="/:id?" component={Main} />
                    <Route component={NoMatchPage}/>
                </Switch>
            </div> 
            </BrowserRouter>
        );
    }

}
 
export default App;