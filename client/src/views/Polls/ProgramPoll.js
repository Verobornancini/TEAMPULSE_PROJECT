import React from 'react';
import { Provider } from "react-redux";
import { store } from "../../actions/store";
import { Container} from "@material-ui/core";
/* import ButterToast, { POS_RIGHT, POS_TOP } from "butter-toast"; */
import ProgramPolls from "./ProgramPolls"



function CrudEmployee() {
  /*  */
  /*   const classes = useStyles(); */
 
 
  return (
    <Provider store={store}>
      <Container maxWidth="lg">

        <ProgramPolls />

      </Container>
    </Provider>
  );
}

export default CrudEmployee;
