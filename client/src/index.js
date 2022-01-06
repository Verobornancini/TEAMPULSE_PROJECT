
import React from "react";
import ReactDOM from "react-dom";
import App from "./App"


import "./assets/css/material-dashboard-react.css?v=1.9.0";

/* const hist = createBrowserHistory(); */
/*  */
/* const adminUser = {user: "admin", password: "1234"} */
/*  */
/* const [user, setUser] = useState({user: ""}) */
/* const [error, setError] = useState("") */
/*  */
/* const login = (details) => { */
/*   if(adminUser.user === details.username && adminUser.password === details.password) { */
/*     setUser({user: details.username}) */
/*   } else { */
/*     console.log("no entra") */
/*   } */
/* } */

ReactDOM.render(<App/>,document.getElementById("root"));
