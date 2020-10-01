import React from 'react';

import './App.css';
import SignInScreen from "./components/SignInScreen";

import {BrowserRouter, Redirect} from "react-router-dom";
import Paperbase from "./paperbase/Paperbase";
import {Route, Switch} from "react-router";
import RegisterScreen from "./components/RegisterScreen";
import Store from './store/Store';
import {observer} from "mobx-react";



const App = observer(() => {
  return (
    <BrowserRouter>
      <div >
          <Switch>
              {/*<GuardedRoute path='/' component={Paperbase} auth={Store.validate()} redirect='/signin'/>*/}
              <Route path={'/'} exact  render={(props) => (
                  Store.signedIn === true
                      ? <Paperbase {...props} />
                      : <Redirect to={{
                          pathname: '/signin',
                          state: { from: '/' }
                      }} />
              )}/>
              <Route path={'/signin'} exact component={SignInScreen}/>
              <Route path={'/register'} exact component={RegisterScreen}/>
          </Switch>
      </div>
    </BrowserRouter>
  );
})

export default App;
