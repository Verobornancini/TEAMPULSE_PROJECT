import React from 'react';
import './Crud.css';
import { Provider } from "react-redux";
import { store } from "../../actions/store";
import { Container } from "@material-ui/core";
/* import ButterToast, { POS_RIGHT, POS_TOP } from "butter-toast"; */
import Teams from "../../components/CRUD/teams"

function CrudTeams() {



  return (
    <Provider store={store}>
      <Container maxWidth="lg">
            <Teams />
      </Container>
    </Provider>
  );
}

export default CrudTeams;
