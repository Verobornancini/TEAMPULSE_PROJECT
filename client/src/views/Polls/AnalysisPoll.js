import React, { useState, useEffect } from "react";
/* import PropTypes from "prop-types"; */
import classnames from "classnames";
import { connect } from "react-redux";
// react plugin for creating charts
/* import ChartistGraph from "react-chartist"; */
// @material-ui/core
import { makeStyles, withStyles, Grid, InputLabel } from "@material-ui/core";
/* import Icon from "@material-ui/core/Icon"; */
// @material-ui/icons
import LibraryBooks from "@material-ui/icons/LibraryBooks";
/* import AccessTime from "@material-ui/icons/AccessTime"; */
// core components
/* import GridItem from "../../components/Grid/GridItem.js"; */
/* import GridContainer from "../../components/Grid/GridContainer.js"; */
/* import Table from "components/Table/Table.js"; */
/* import Tasks from "../../components/Tasks/Tasks.js"; */
import CustomTabs from "../../components/CustomTabs/CustomTabs.js";
/* import Danger from "components/Typography/Danger.js"; */
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
/* import CardIcon from "components/Card/CardIcon.js"; */
/* import CardBody from "components/Card/CardBody.js"; */
import CardFooter from "../../components/Card/CardFooter.js";
import Checkbox from "@material-ui/core/Checkbox";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Button from "../../components/CustomButtons/Button.js";
import Check from "@material-ui/icons/Check";
/* import Tabletop from "tabletop"; */
import { encuestas } from "../../variables/general.js";
import * as actions from "../../actions/sendPolls";
import styles from "../../assets/jss/material-dashboard-react/views/dashboardStyle.js";
import stylesTasks from "../../assets/jss/material-dashboard-react/components/tasksStyle.js";
import TextField from '@material-ui/core/TextField';
import Thermometer from 'react-thermometer-component'
import Tabletop from 'tabletop'
import axios from "axios";


const baseUrl = 'http://' + window.location.hostname + ':8080/'
//const baseUrl = process.env.REACT_APP_SERVER_URL //'http://100.26.46.75:8080/'

const useStyles2 = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2)
  },
  textInput: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2)
  },
  termometros: {
    alignItems: "center",
    margin: theme.spacing(2),
    paddingRight: theme.spacing(5),
    paddingLeft: theme.spacing(5)

  }

}));


const styles2 = theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1)
    },
  }
});


const useStyles = makeStyles(styles);
const useStylesTasks = makeStyles(stylesTasks);

/* export default function ProgramPolls(props) { */
export default function AnalysisPolls() {

  const [dataEncuestas, setDataEncuestas] = useState([]);

  useEffect(() => {
    var url = baseUrl + 'indiceBienestar'
    axios.get(url)

      .then(
        (result) => {
          setDataEncuestas(result.data);
        },
        (error) => {
          console.log(error)
        }
      )
  }, [])

  /* useEffect(() => { */
  /*   Tabletop.init({ */
  /*     key: "1F8WVHrFFVgkvZuFW1f1pyLGon_coWckyrbpKG07tWzo", */
  /*     simpleSheet: true */
  /*   }) */
  /*     .then((data) => setDataEncuestas(data)) */
  /*     .catch((err) => console.warn(err)); */
  /* }, []); */







  var primero = 0;
  var sentirFirst = '';
  var pensarFirst = '';
  var hacerFirst = '';
  var sentirSecond = '';
  var pensarSecond = '';
  var hacerSecond = '';
  var dataEmotions = dataEncuestas.map(function (dataEmotions) {

    if (primero === 0) {
      sentirFirst = dataEmotions.sentir;
      pensarFirst = dataEmotions.hacer;
      hacerFirst = dataEmotions.pensar;
      primero = 1;
    } else {
      sentirSecond = dataEmotions.sentir;
      pensarSecond = dataEmotions.hacer;
      hacerSecond = dataEmotions.pensar;
      primero = 0;
    }

    return primero;
  });
  if (sentirFirst !== undefined) {
    sentirFirst = sentirFirst.replace(',', '.')
    pensarFirst = pensarFirst.replace(',', '.')
    hacerFirst = hacerFirst.replace(',', '.')
    sentirSecond = sentirSecond.replace(',', '.')
    pensarSecond = pensarSecond.replace(',', '.')
    hacerSecond = hacerSecond.replace(',', '.')
  }
  var sentirDif  = 0;
  var pensarDif = 0;
  var hacerDif   = 0;

  if (sentirFirst !== undefined) {
    sentirDif = sentirSecond - sentirFirst;
    pensarDif = pensarSecond - pensarFirst;
    hacerDif = hacerSecond - hacerFirst;

    sentirDif = sentirDif.toFixed(2);
    pensarDif = pensarDif.toFixed(2);
    hacerDif = hacerDif.toFixed(2);
  }



  const classesPoll = useStyles();
  const classes2 = useStyles2();
  return (
    <div>
      <Card>
        <CardHeader color="warning">
          <h3 className={classesPoll.cardTitleWhiteCenter}>Estado de bienestar</h3>
          <h5 className={classesPoll.cardTitleWhiteCenter}>Medición mensual de niveles de bienestar</h5>
        </CardHeader>
        <Grid container>
          <Grid item xs={3}>
            <Card>
              <CardHeader color="warning">
                <h5 className={classesPoll.cardTitleWhite}>Conformidad con el  trabajo</h5>
              </CardHeader>
              <div container className={classes2.termometros} >
                <Thermometer
                  theme="light"
                  value={sentirSecond}
                  max="1"
                  steps="2"
                  format=""
                  size="normal"
                  height="200"
                />
                <CardFooter statsPolls>
                  <div className={classesPoll.statsPolls} style={{ paddingLeft: "10%" }}>
                    ▲ {sentirDif}
                  </div>
                </CardFooter>
              </div>
            </Card>
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={3}>
            <Card>
              <CardHeader color="warning">
                <h5 className={classesPoll.cardTitleWhite}>Administración del tiempo libre</h5>
              </CardHeader>
              <div container className={classes2.termometros} >
                <Thermometer
                  theme="light"
                  value={pensarSecond}
                  max="1"
                  steps="2"
                  format=""
                  size="normal"
                  height="200"
                />
                <CardFooter statsPolls>
                  <div className={classesPoll.statsPolls} style={{ paddingLeft: "10%" }}>
                    ▲ {pensarDif}
                  </div>
                </CardFooter>
              </div>
            </Card>
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={3}>
            <Card>
              <CardHeader color="warning">
                <h5 className={classesPoll.cardTitleWhite}>Percepción de la situación actual</h5>
              </CardHeader>
              <div container className={classes2.termometros} >
                <Thermometer
                  theme="light"
                  value={hacerSecond}
                  max="1"
                  steps="2"
                  format=""
                  size="normal"
                  height="200"
                />
                <CardFooter statsPolls>
                  <div className={classesPoll.statsPolls} style={{ paddingLeft: "10%" }}>
                    ▲ {hacerDif}
                  </div>
                </CardFooter>
              </div>
            </Card>
          </Grid>

        </Grid>
      </Card>
    </div >
  );

}

