import React, { useEffect, useState } from "react";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
/* import Table from "../../components/Table/Table.js"; */
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
/* import CardIcon from "components/Card/CardIcon.js"; */
import CardBody from "../../components/Card/CardBody.js";
import RadarChart from 'react-apexcharts'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Paper } from '@material-ui/core'
import styles from "../../assets/jss/material-dashboard-react/views/dashboardStyle.js";
import Tabletop from "tabletop";
import axios from "axios";


const baseUrl = 'http://' + window.location.hostname + ':8080/'
//const baseUrl = process.env.REACT_APP_SERVER_URL //'http://100.26.46.75:8080/'


const useStyles = makeStyles(styles);


export default function Hitos() {
  const classes = useStyles();

  const [data, setData] = useState([]);
  const [dataPositivos, setDataPositivos] = useState([]);
  const [dataNegativos, setDataNegativos] = useState([]);

  useEffect(() => {
    var url = baseUrl + 'topWords'
    axios.get(url)
     
      .then(
        (result) => {
          setData(result.data);
        },
        (error) => {
          console.log(error)
        }
      )
  }, [])

  useEffect(() => {
    var url = baseUrl + 'topWordsPositive'
    axios.get(url)
     
      .then(
        (result) => {
          setDataPositivos(result.data);
        },
        (error) => {
          console.log(error)
        }
      )
  }, [])

  useEffect(() => {
    var url = baseUrl + 'topWordsNegative'
    axios.get(url)
     
      .then(
        (result) => {
          setDataNegativos(result.data);
        },
        (error) => {
          console.log(error)
        }
      )
  }, [])

/*   useEffect(() => { */
/*     Tabletop.init({ */
/*       key: "1Z4Kq39rzoocM2ZL8qEbRi3qGsZG7C5Wkx_GoJAs3r9s", //semanal */
/*       simpleSheet: true */
/*     }) */
/*       .then((data) => setData(data)) */
/*       .catch((err) => console.warn(err)); */
/*   }, []); */
/*  */
/*   useEffect(() => { */
/*     Tabletop.init({ */
/*       key: "1RYFUt6pVakvh0-raq3X8V4UcH12ygMaKc0rZqpP3TWU", //Positivos */
/*       simpleSheet: true */
/*     }) */
/*       .then((data) => setDataPositivos(data)) */
/*       .catch((err) => console.warn(err)); */
/*   }, []); */
/*  */
/*   useEffect(() => { */
/*     Tabletop.init({ */
/*       key: "131-g_y1GP3BWl8PNaZKNUr7n8a3LvXsxykx07C0Kgo0", //Negativos */
/*       simpleSheet: true */
/*     }) */
/*       .then((data) => setDataNegativos(data)) */
/*       .catch((err) => console.warn(err)); */
/*   }, []); */


  var palabraPositivos = ''
  var cantidadPositivos = ''
  var dataTonos = dataPositivos.map(function (dataTonos) {
    palabraPositivos += dataTonos.Word.toUpperCase() + ',';
    cantidadPositivos += dataTonos.Count + ',';
    var algo = '1';
    return algo;
  });
  if (dataTonos)
    console.log('datatonosweek')
  palabraPositivos = palabraPositivos.slice(0, -1)
  palabraPositivos = palabraPositivos.split(',')
  cantidadPositivos = cantidadPositivos.slice(0, -1)
  cantidadPositivos = cantidadPositivos.split(',')


  const dataTonosChart = {
    series: [{
      name: 'Repetidas',
      data: cantidadPositivos
    }],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: false,
      },
      plotOptions: {
        bar: {
          barHeight: '50%',
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 1,
        colors: ['#fff'],
        curve: 'smooth'
      },
      xaxis: {
        categories: palabraPositivos,
        labels: {
          formatter: function (val) {
            return val
          }
        }
      },
      yaxis: {
        title: {
          text: 'Cantidad de Mensajes',
          style: {
            colors: [],
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 200,
            cssClass: 'apexcharts-yaxis-label',
          },
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val
          }
        }
      },
      colors: ['#00E396', '#FEB019', '#FF4560', '#E91E63', '#FF9800'],
      fill: {
        opacity: 1
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 20
      }
    },
  };

  var palabraNegativos = ''
  var cantidadNegativos = ''
  var dataTonos = dataNegativos.map(function (dataTonos) {
    palabraNegativos += dataTonos.Word.toUpperCase() + ',';
    cantidadNegativos += dataTonos.Count + ',';
    var algo = '1';
    return algo;
  });
  if (dataTonos)
    console.log('datatonosweek')
  palabraNegativos = palabraNegativos.slice(0, -1)
  palabraNegativos = palabraNegativos.split(',')
  cantidadNegativos = cantidadNegativos.slice(0, -1)
  cantidadNegativos = cantidadNegativos.split(',')
  const dataTonosChartNegativos = {
    series: [{
      name: 'Repetidas',
      data: cantidadNegativos
    }],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: false,
      },
      plotOptions: {
        bar: {
          barHeight: '50%',
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 1,
        colors: ['#fff'],
        curve: 'smooth'
      },
      xaxis: {
        categories: palabraNegativos,
        labels: {
          formatter: function (val) {
            return val
          }
        }
      },
      yaxis: {
        title: {
          text: 'Cantidad de Mensajes',
          style: {
            colors: [],
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 200,
            cssClass: 'apexcharts-yaxis-label',
          },
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val
          }
        }
      },
      colors: ['#FF4560', '#E91E63', '#FF9800'],
      fill: {
        opacity: 1
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 20
      }
    },
  };

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="success">
              <h4 className={classes.cardTitleWhite}>Top 10: Palabras más frecuentes en comentarios positivos</h4>
            </CardHeader>
            <CardBody>
              <RadarChart options={dataTonosChart.options} series={dataTonosChart.series} type="bar" height={250} />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="success">
              <h4 className={classes.cardTitleWhite}>Top 10: Palabras más frecuentes en comentarios negativos</h4>
            </CardHeader>
            <CardBody>
              <RadarChart options={dataTonosChartNegativos.options} series={dataTonosChartNegativos.series} type="bar" height={250} />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="success">
              <h4 className={classes.cardTitleWhite}>Palabras más frecuentes globales</h4>
              {/*               <p className={classes.cardCategoryWhite}> */}
              {/*                 Actividades realizadas dentro de la empresa */}
              {/*         </p> */}
            </CardHeader>
            <CardBody>
              <TableContainer component={Paper}>
                {(data) ?
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">Palabra</TableCell>
                        <TableCell align="left">Cantidad de repeticiones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map((record, index) => (
                        <TableRow key={record.Count}>
                          <TableCell align="left">{record.Word.toUpperCase()}</TableCell>
                          <TableCell component="th" scope="row" align="left">{record.Count}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  :
                  ''
                }
              </TableContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>

      </GridContainer>
    </div>
  );
}
