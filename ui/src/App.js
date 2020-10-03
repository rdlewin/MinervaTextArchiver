import React from 'react';

import './App.css';
import SignInScreen from "./layout/SignInScreen";

import {BrowserRouter, Redirect} from "react-router-dom";
import Paperbase from "./layout/Paperbase";
import {Route, Switch} from "react-router";
import RegisterScreen from "./layout/RegisterScreen";
import Store from './store/Store';
import {observer} from "mobx-react";
import AddApp from "./components/registration/AddApp";



const App = observer(() => {
  return (
    <BrowserRouter>
      <div >
          <Switch>

              <Route path={'/signin'} exact component={SignInScreen}/>
              {/*{user_uid}/{token}*/}
              <Route path={'/register/:user_uid/:token'}  component={RegisterScreen}/>
              {/*{user_uid}/{token}/{app_id}/{app_user_uid}*/}
              <Route path={'/addapp/:user_uid/:token/:app_id/:app_user_uid'}  component={AddApp}/>
              <Route path={'/'}   render={(props) => (
                  Store.signedIn === true
                      ? <Paperbase {...props} />
                      : <Redirect to={{
                          pathname: '/signin',
                          state: { from: '/' }
                      }} />
              )}/>

          </Switch>
      </div>
    </BrowserRouter>
  );
})

export default App;
