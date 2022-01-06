import React from 'react';
import './Crud.css';
import { Provider } from "react-redux";
import { store } from "../../actions/store";
import { Container} from "@material-ui/core";
/* import ButterToast, { POS_RIGHT, POS_TOP } from "butter-toast"; */
import Employees from "../../components/CRUD/Employees"



function CrudEmployee() {
  /*  */
  /*   const classes = useStyles(); */
 
 
  return (
    <Provider store={store}>
      <Container maxWidth="lg">

        <Employees />

      </Container>
    </Provider>
  );
}

export default CrudEmployee;
