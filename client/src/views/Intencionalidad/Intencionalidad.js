import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tabletop from "tabletop";
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";
import Chart from 'react-apexcharts'
import styles from "../../assets/jss/material-dashboard-react/views/dashboardStyle.js";
import axios from "axios";


const baseUrl = 'http://' + window.location.hostname + ':8080/'
//const baseUrl = process.env.REACT_APP_SERVER_URL //'http://100.26.46.75:8080/'

const useStyles = makeStyles(styles);

export default function Dashboard() {

  const [dataSemanal, setDataSemanal] = useState([]);
  const [dataWeek, setDataWeek] = useState([]);
  const [dataTonosSlack, setDataTonosSlack] = useState([]);
  useEffect(() => {
    /* actions.fetchAll() */
    var url = baseUrl + 'messages7Days'
    axios.get(url)
      /* .then(res => res.json()) */
      .then(
        (result) => {
          setDataSemanal(result.data);
        },
        (error) => {
          console.log(error)
        }
      )
  }, [])

 /*  useEffect(() => { */
 /*    Tabletop.init({ */
 /*      key: "1LZfWmbJjqEy-UCSHtgIyXWRtLe7yDN3mngTmzTCtLJE", //semanal */
 /*      simpleSheet: true */
 /*    }) */
 /*      .then((data) => setDataSemanal(data)) */
 /*      .catch((err) => console.warn(err)); */
 /*  }, []); */

 useEffect(() => {
  /* actions.fetchAll() */
  var url = baseUrl + 'weekMessages'
  axios.get(url)
    /* .then(res => res.json()) */
    .then(
      (result) => {
        setDataWeek(result.data);
      },
      (error) => {
        console.log(error)
      }
    )
}, [])

useEffect(() => {
  /* actions.fetchAll() */
  var url = baseUrl + 'channelMessages'
  axios.get(url)
    /* .then(res => res.json()) */
    .then(
      (result) => {
        setDataTonosSlack(result.data);
      },
      (error) => {
        console.log(error)
      }
    )
}, [])
 /*  useEffect(() => { */
 /*    Tabletop.init({ */
 /*      key: "1Y2sZQ27wdUUXTvM-kDDXTDkzGDUnSeU_UtDnkBAlCew", //semanaasemana */
 /*      simpleSheet: true */
 /*    }) */
 /*      .then((data) => setDataWeek(data)) */
 /*      .catch((err) => console.warn(err)); */
 /*  }, []); */

 /*  useEffect(() => { */
 /*    Tabletop.init({ */
 /*      key: "1YxApFNjfLPzcaKTPCC6FrD21VOsN6vm10_08xDBLi-Y",//tonos */
 /*      simpleSheet: true */
 /*    }) */
 /*      .then((data) => setDataTonos(data)) */
 /*      .catch((err) => console.warn(err)); */
 /*  }, []); */



  var dataPositivos = ''
  var dataNegativo = ''
  var dataNeutro = ''
  var dataAreas = ''
  var dataTonos = dataWeek.map(function (dataTonos) {
    dataPositivos += dataTonos.POS + ',';
    dataNegativo += dataTonos.NEG + ',';
    dataNeutro += dataTonos.NEU + ',';
    //dataAreas += dataTonos.week.toUpperCase() + ',';
    dataAreas += dataTonos.year_week.toUpperCase() + ',';
    var algo = '1';
    return algo;
  });
  if (dataTonos)
    console.log('-')

  dataPositivos = dataPositivos.slice(0, -1)
  dataPositivos = dataPositivos.split(',')
  dataNeutro = dataNeutro.slice(0, -1)
  dataNeutro = dataNeutro.split(',')
  dataNegativo = dataNegativo.slice(0, -1)
  dataNegativo = dataNegativo.split(',')
  dataAreas = dataAreas.slice(0, -1)
  dataAreas = dataAreas.split(',')



  const dataTonosChart = {
    series: [{
      name: 'Positivo',
      data: dataPositivos
    }, {
      name: 'Neutral',
      data: dataNeutro
    }, {
      name: 'Negativo',
      data: dataNegativo
    }],
    options: {
      chart: {
        height: 350,
        type: 'area',
        stacked: false
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
        labels: {
          rotate: -45,
          rotateAlways: true,
          formatter: function (val) {
            return val
          }
        },
        categories: dataAreas
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


  var dataPositivos7 = ''
  var dataNegativo7 = ''
  var dataNeutro7 = ''
  var dataAreas7 = ''
  var dataTonos7 = dataSemanal.map(function (dataTonos) {
    dataPositivos7 += dataTonos.POS + ',';
    dataNegativo7 += dataTonos.NEG + ',';
    dataNeutro7 += dataTonos.NEU + ',';
    dataAreas7 += dataTonos.date + ',';
    var algo = '1';
    return algo;
  });
  if (dataTonos7)
    console.log('-')

  dataPositivos7 = dataPositivos7.slice(0, -1)
  dataPositivos7 = dataPositivos7.split(',')
  dataNeutro7 = dataNeutro7.slice(0, -1)
  dataNeutro7 = dataNeutro7.split(',')
  dataNegativo7 = dataNegativo7.slice(0, -1)
  dataNegativo7 = dataNegativo7.split(',')
  dataAreas7 = dataAreas7.slice(0, -1)
  dataAreas7 = dataAreas7.split(',')

  const dataTonosChart7 = {
    series: [{
      name: 'Positivo',
      data: dataPositivos7
    }, {
      name: 'Neutral',
      data: dataNeutro7
    }, {
      name: 'Negativo',
      data: dataNegativo7
    }],
    options: {
      chart: {
        height: 350,
        type: 'area',
        stacked: false
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
        categories: dataAreas7,
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
  var dataPositivosTonos = ''
  var dataNegativoTonos = ''
  var dataNeutroTonos = ''
  var dataAreasTonos = ''
  var algo = ''
  var dataTonosTota = dataTonosSlack.map(function (dataTonos) {

    dataAreasTonos += dataTonos.Channel_name.toUpperCase() + ',';

    if (dataTonos.POS === "0") {
      dataPositivosTonos += '0' + ',';
      dataPositivosTonos += '0' + ',';
    } else {
      dataPositivosTonos += dataTonos.POS + ',';
    }

    if (dataTonos.NEU === "0") {
      dataNeutroTonos += '0' + ',';
      dataNeutroTonos += '0' + ',';
    } else {
      dataNeutroTonos += dataTonos.NEU + ',';
    }

    if (dataTonos.NEG === "0") {
      dataNegativoTonos += '0' + ',';
      dataNegativoTonos += '0' + ',';
    } else {
      dataNegativoTonos += dataTonos.NEG + ',';
    }

    return dataTonos;
  });
  if (dataTonosTota)
    console.log('-')
/*  */
/*   console.log(dataTonosSlack) */
/*   console.log(algo) */

  dataPositivosTonos = dataPositivosTonos.slice(0, -1)
  dataPositivosTonos = dataPositivosTonos.split(',')
  dataNeutroTonos = dataNeutroTonos.slice(0, -1)
  dataNeutroTonos = dataNeutroTonos.split(',')
  dataNegativoTonos = dataNegativoTonos.slice(0, -1)
  dataNegativoTonos = dataNegativoTonos.split(',')
  dataAreasTonos = dataAreasTonos.slice(0, -1)
  dataAreasTonos = dataAreasTonos.split(',')
  const dataTonosChartTota = {
    series: [{
      name: 'Positivo',
      data: dataPositivosTonos
    }, {
      name: 'Neutral',
      data: dataNeutroTonos
    }, {
      name: 'Negativo',
      data: dataNegativoTonos
    }],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        stackType: '100%'
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '50%',
        },
      },
      stroke: {
        width: 1,
        colors: ['#fff']
      },
      xaxis: {
        categories: dataAreasTonos,
        labels: {
          formatter: function (val) {
            return val
          }
        }
      },
      yaxis: {
        title: {
          text: undefined
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + "%"
          }
        }
      },
      colors: ['#00E396', '#FEB019', '#FF4560', '#E91E63', '#FF9800'],
      /*  colors: [function({ name, seriesIndex, w }) { */
      /*    if (name === 'Positivo') { */
      /*        return '#7E36AF' */
      /*    } else { */
      /*        return '#D9534F' */
      /*    } */
      /*  }, function({ name, seriesIndex, w }) { */
      /*    if (name < 111) { */
      /*        return '#7E36AF' */
      /*    } else { */
      /*        return '#D9534F' */
      /*    } */
      /*  }], */
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


  const classes = useStyles();
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card chart>
            <CardHeader color="success">
              <h4 className={classes.cardTitleWhite} >Intención de los comentarios por canal</h4>
            </CardHeader>
            <CardBody>
              <Chart options={dataTonosChartTota.options} series={dataTonosChartTota.series} type="bar" height={350} />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="success">
              <h4 className={classes.cardTitleWhite}>Intención de los comentarios en los últimos 7 días</h4>
            </CardHeader>
            <CardBody>
              <Chart options={dataTonosChart7.options} series={dataTonosChart7.series} type="area" height={250} />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="success">
              <h4 className={classes.cardTitleWhite}>Intención de los comentarios por semana</h4>
            </CardHeader>
            <CardBody>
              <Chart options={dataTonosChart.options} series={dataTonosChart.series} type="area" height={250} />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
