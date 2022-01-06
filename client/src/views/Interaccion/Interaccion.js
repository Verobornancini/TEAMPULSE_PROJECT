import React, { useEffect, useState } from "react";
// react plugin for creating charts
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
/* import AccessTime from "@material-ui/icons/AccessTime"; */
// core components
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";
/* import CardFooter from "../../components/Card/CardFooter.js"; */
import RadarChart from 'react-apexcharts';
/* import { */
/*   dataChart */
/* } from "../../variables/charts.js"; */
import styles from "../../assets/jss/material-dashboard-react/views/dashboardStyle.js";
import Tabletop from "tabletop";
/* import Table from '@material-ui/core/Table'; */
/* import TableBody from '@material-ui/core/TableBody'; */
/* import TableCell from '@material-ui/core/TableCell'; */
/* import TableContainer from '@material-ui/core/TableContainer'; */
/* import TableHead from '@material-ui/core/TableHead'; */
/* import TableRow from '@material-ui/core/TableRow'; */
/* import { Paper } from '@material-ui/core' */
import Skeleton from '@material-ui/lab/Skeleton';
/* import Button from "../../components/CustomButtons/Button.js"; */
import Modal from '@material-ui/core/Modal';
import axios from "axios";


const baseUrl = 'http://' + window.location.hostname + ':8080/'
//const baseUrl = process.env.REACT_APP_SERVER_URL //'http://100.26.46.75:8080/'

const useStyles = makeStyles(styles);

export default function AreaVision() {

  /*   const [data, setData] = useState([]); */
 /*  const [dataTonosSlack, setDataTonos] = useState([]); */
  const [dataEmojis, setDataEmojis] = useState([]);
  const [dataEmojis2, setDataEmojis2] = useState([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    /* actions.fetchAll() */
    var url = baseUrl + 'top5Reactions'
    axios.get(url)
      /* .then(res => res.json()) */
      .then(
        (result) => {
          setDataEmojis(result.data)
        },
        (error) => {
          console.log(error)
        }
      )
  }, [])

  useEffect(() => {
    /* actions.fetchAll() */
    var url = baseUrl + 'top5Emojis'
    axios.get(url)
      /* .then(res => res.json()) */
      .then(
        (result) => {
          setDataEmojis2(result.data)
        },
        (error) => {
          console.log(error)
        }
      )
  }, [])
/*   useEffect(() => { */
/*     Tabletop.init({ */
/*       key: "12DD6EdkNMwTVL8xLkb0zO7AfIWR_ahmncX6STSileu0", */
/*       simpleSheet: true */
/*     }) */
/*       .then((data) => setDataEmojis(data)) */
/*       .catch((err) => console.warn(err)); */
/*   }, []); */
/*  */
/*   useEffect(() => { */
/*     Tabletop.init({ */
/*       key: "1q1Q8yx8T599SW4mUzK6I-C6jBk3AYy7pT3Og-pS-F5g", */
/*       simpleSheet: true */
/*     }) */
/*       .then((data) => setDataEmojis2(data)) */
/*       .catch((err) => console.warn(err)); */
/*   }, []); */
/*  */
  var headersEmojis = [];
  for (var i = 0; i < 1; i++) {
    var temp = dataEmojis[1];
    for (var key in temp) {
      headersEmojis.push(key);
    }
  }


  var dataEmotions = dataEmojis.map(function (dataEmotions) {
    /* var detalle = {}; */

    /* var detalle = new Array(dataEmotions.tristeza, dataEmotions.alegria, dataEmotions.miedo, dataEmotions.angustia, dataEmotions.enfado);
 */
    /* var detalle = [dataEmotions.tristeza, dataEmotions.alegria, dataEmotions.miedo, dataEmotions.angustia, dataEmotions.enfado]; */
    var detalle = [dataEmotions[headersEmojis[0]], dataEmotions[headersEmojis[1]], dataEmotions[headersEmojis[2]], dataEmotions[headersEmojis[3]], dataEmotions[headersEmojis[4]]]


    var info = {
      "name": dataEmotions.channel_name.toUpperCase(),
      "data": detalle
    }
    return info;
  });

  var headersEmojis2 = [];
  for (var j = 0; j < 1; j++) {
    var temp2 = dataEmojis2[1];
    for (var key2 in temp2) {
      headersEmojis2.push(key2);
    }
  }

  var dataEmotions2 = dataEmojis2.map(function (dataEmotions) {
    var detalle = [dataEmotions[headersEmojis2[0]], dataEmotions[headersEmojis2[1]], dataEmotions[headersEmojis2[2]], dataEmotions[headersEmojis2[3]], dataEmotions[headersEmojis2[4]]]
    var info = {
      "name": dataEmotions.channel_name.toUpperCase(),
      "data": detalle
    }
    return info;
  });



  const dataChart = {
    options: {
      chart: {
        height: 350,
        type: 'radar',
        dropShadow: {
          enabled: true,
          blur: 1,
          left: 1,
          top: 1
        }
      },
      stroke: {
        width: 2
      },
      fill: {
        opacity: 0.1
      },
      colors: ['#00E396', '#FEB019', '#FF4560', '#E91E63', '#FF9800','#33B2DF', '#546E7A', '#D4526E', '#13D8AA','#A5978B'],
      markers: {
        size: 2
      },
      xaxis: {
        categories: headersEmojis
      }
    },


  };

  const dataChartEmojis2 = {
    options: {
      chart: {
        height: 350,
        type: 'radar',
        dropShadow: {
          enabled: true,
          blur: 1,
          left: 1,
          top: 1
        }
      },
      stroke: {
        width: 2
      },
      fill: {
        opacity: 0.1
      },
      colors: ['#00E396', '#FEB019', '#FF4560', '#E91E63', '#FF9800','#33B2DF', '#546E7A', '#D4526E', '#13D8AA','#A5978B'],
      markers: {
        size: 2
      },
      xaxis: {
        categories: headersEmojis2
      }
    },
  };
  /*  const handleOpen = () => { */
  /*    setOpen(true); */
  /*  }; */
  const handleClose = () => {
    setOpen(false);
  };

  const classes = useStyles();

  return (

    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color="success">
              <h4 className={classes.cardTitleWhite}>Top 5 Reacciones</h4>
            </CardHeader>
            <CardBody>
              {(dataEmojis) ?
                <RadarChart options={dataChart.options} series={dataEmotions} type="radar" height={350} />
                :
                <Skeleton variant="rect" width={210} height={118} />
              }
            </CardBody>
            {/*   <CardFooter chart> */}
            {/*     <div className={classes.stats}> */}
            {/*       <AccessTime /> Campaña de los últimos 4 meses */}
            {/*     </div> */}
            {/*     {/*   <Button color="success" onClick={() => handleOpen()}>Definiciones</Button> */}


            {/*   </CardFooter> */}
          </Card>

        </GridItem>
        <GridItem  xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color="success">
              <h4 className={classes.cardTitleWhite}>Top 5 Emojis</h4>
            </CardHeader>
            <CardBody>
              {(dataEmojis) ?
                <RadarChart options={dataChartEmojis2.options} series={dataEmotions2} type="radar" height={350} />
                :
                <Skeleton variant="rect" width={210} height={118} />
              }
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        className={classes.modal}
      >
        <div>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12} >
              <Card>
                <CardHeader color="warning">
                  <h4 className={classes.cardTitleWhite}>Emociones</h4>
                </CardHeader>
                <CardBody>
                  <div className={classes.typo}>
                    <p>
                      <b><u>Tristeza:</u></b> Sentimiento de dolor anímico producido por un suceso desfavorable que suele manifestarse con un estado de ánimo pesimista, la insatisfacción y la tendencia al llanto.
                </p>
                    <p>
                      <b><u>Alegría:</u></b> Estado de ánimo de la persona que se siente plenamente satisfecha por gozar de lo que desea o por disfrutar de algo bueno.
                </p>
                    <p>
                      <b><u>Miedo:</u></b> Sentimiento de desconfianza que impulsa a creer que ocurrirá un hecho contrario a lo que se desea.

                </p>
                    <p>
                      <b><u>Angustia:</u></b> Estado afectivo que se caracteriza por aparecer como reacción ante un peligro desconocido o impresión

                </p>
                    <p>

                      <b><u>Enfado:</u></b> Sentimiento de disgusto y mala disposición hacia una persona o cosa, generalmente a causa de algo que contraría o perjudica.
                </p>
                  </div>

                </CardBody>
              </Card>

            </GridItem>
          </GridContainer>
        </div>
      </Modal>
      {/*<GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Areas Laborales</h4>
              <p className={classes.cardCategoryWhite}>
                Diferentes departamentos dentro de la empresa
              </p>
            </CardHeader>
            <CardBody>
              <TableContainer component={Paper}>
                {(data) ?
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Orden</TableCell>
                        <TableCell align="left">Nombre</TableCell>
                        <TableCell align="left">Nro. Empleados</TableCell>
                        <TableCell align="left">Tristeza</TableCell>
                        <TableCell align="left">Alegría</TableCell>
                        <TableCell align="left">Miedo</TableCell>
                        <TableCell align="left">Angustia</TableCell>
                        <TableCell align="left">Enfado</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map((record, index) => (
                        <TableRow key={record.orden}>
                          <TableCell component="th" scope="row">
                            {record.orden}
                          </TableCell>
                          <TableCell align="left">{record.area.toUpperCase()}</TableCell>
                          <TableCell align="left">{record.empleados}</TableCell>
                          <TableCell align="left">{record.tristeza}%</TableCell>
                          <TableCell align="left">{record.alegria}%</TableCell>
                          <TableCell align="left">{record.miedo}%</TableCell>
                          <TableCell align="left">{record.angustia}%</TableCell>
                          <TableCell align="left">{record.enfado}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  :
                  <Skeleton variant="rect" width={210} height={118} />
                }
              </TableContainer>
            </CardBody>
          </Card>
        </GridItem>
              </GridContainer>*/}

    </div >
  );
}
