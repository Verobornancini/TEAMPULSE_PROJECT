import React, { useState } from 'react';
/* import logo from './logo.svg'; */
import './App.css';
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
// core components
import Admin from "./layouts/Admin.js";
import Login from "./views/Login/LoginForm"
import useToken from './useToken';


const adminUser = { user: "admin", password: "1234" };
const hist = createBrowserHistory();

/* function setToken(userToken) { */
/*   sessionStorage.setItem('token', JSON.stringify(userToken)); */
/* } */
/*  */
/* function getToken() { */
/*   const tokenString = sessionStorage.getItem('token'); */
/*   const userToken = JSON.parse(tokenString); */
/*   return userToken?.token */
/* } */

function App() {

  const [user, setUser] = useState({ user: "" })
  const [error, setError] = useState("")
  //const [token, setToken] = useState();

  const { token, setToken } = useToken();

  const login = (details) => {
    if (adminUser.user === details.username && adminUser.password === details.password) {
      setUser({ user: details.username })
    } else {
      setError("Error al loguearse!")
    }
  }



  if (!token) {
    return <Login setToken={setToken} />
  }





  return (
    <Router history={hist}>
      <Switch>
        <Route path="/admin" component={Admin} />
        <Route path="/">
          <Redirect from="/" to="/admin/Conversaciones" />
        </Route>
        {/*(user.user === "") ?
          <Route path="/">
            <Login login={login} error={error} />
          </Route>
          :
          <Route path="/">
            <Redirect from="/" to="/admin/Conversaciones" />
            <Route path="/admin" component={Admin} />
          </Route>
  */}


      </Switch>
    </Router>
  );
}

export default App;
