import React, { useEffect, useState } from "react";
// react plugin for creating charts
/* import ChartistGraph from "react-chartist"; */
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
/* import Icon from "@material-ui/core/Icon"; */
/* // @material-ui/icons */
/* import Store from "@material-ui/icons/Store"; */
import Tabletop from "tabletop";
/* import Warning from "@material-ui/icons/Warning"; */
/* import DateRange from "@material-ui/icons/DateRange"; */
/* import LocalOffer from "@material-ui/icons/LocalOffer"; */
/* import Update from "@material-ui/icons/Update"; */
/* import ArrowUpward from "@material-ui/icons/ArrowUpward"; */
/* import LibraryBooks from "@material-ui/icons/LibraryBooks"; */
/* import AccessTime from "@material-ui/icons/AccessTime"; */
/* import Accessibility from "@material-ui/icons/Accessibility"; */
/* // core components */
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
/* import Tasks from "../../components/Tasks/Tasks.js"; */
/* import CustomTabs from "../../components/CustomTabs/CustomTabs.js"; */
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
/* import CardIcon from "../../components/Card/CardIcon.js"; */
import CardBody from "../../components/Card/CardBody.js";
/* import CardFooter from "../../components/Card/CardFooter.js"; */

/* import { todas, positivas, negativas } from "../../variables/general.js"; */
/*  */
/* import { */
/*   dailySalesChart, */
/*   emailsSubscriptionChart, */
/*   completedTasksChart, */
/*   hitosProd */
/* } from "../../variables/charts.js"; */
import Chart from 'react-apexcharts'
import styles from "../../assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

export default function Dashboard() {

  const [dataSemanal, setDataSemanal] = useState([]);
  const [dataWeek, setDataWeek] = useState([]);
  useEffect(() => {
    Tabletop.init({
      key: "1LZfWmbJjqEy-UCSHtgIyXWRtLe7yDN3mngTmzTCtLJE", //semanal
      simpleSheet: true
    })
      .then((data) => setDataSemanal(data))
      .catch((err) => console.warn(err));
  }, []);

  useEffect(() => {
    Tabletop.init({
      key: "1Y2sZQ27wdUUXTvM-kDDXTDkzGDUnSeU_UtDnkBAlCew", //semanaasemana
      simpleSheet: true
    })
      .then((data) => setDataWeek(data))
      .catch((err) => console.warn(err));
  }, []);

  console.log(dataSemanal)

  var dataPositivos = ''
  var dataNegativo = ''
  var dataNeutro = ''
  var dataAreas = ''
  var dataTonos = dataWeek.map(function (dataTonos) {
    dataPositivos += dataTonos.POS + ',';
    dataNegativo += dataTonos.NEG + ',';
    dataNeutro += dataTonos.NEU + ',';
    dataAreas +=  dataTonos.week.toUpperCase() + ',';
    var algo = '1';
    return algo;
  });
  if (dataTonos)
    console.log('datatonosweek')

  dataPositivos = dataPositivos.slice(0, -1)
  dataPositivos = dataPositivos.split(',')
  dataNeutro = dataNeutro.slice(0, -1)
  dataNeutro = dataNeutro.split(',')
  dataNegativo = dataNegativo.slice(0, -1)
  dataNegativo = dataNegativo.split(',')
  dataAreas = dataAreas.slice(0, -1)
  dataAreas = dataAreas.split(',')

  console.log(dataWeek)


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
        categories: dataAreas,
        labels: {
          formatter: function (val) {
            return val
          }
        }
      },
      yaxis: {
        title: {
          text: 'Cantidad de Mensajes'
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
  dataAreas7 +=  dataTonos.date + ',';
  var algo = '1';
  return algo;
});
if (dataTonos7)
  console.log('datatonosweek')
dataPositivos = dataPositivos7.slice(0, -1)
dataPositivos = dataPositivos7.split(',')
dataNeutro = dataNeutro7.slice(0, -1)
dataNeutro = dataNeutro7.split(',')
dataNegativo = dataNegativo7.slice(0, -1)
dataNegativo = dataNegativo7.split(',')
dataAreas = dataAreas7.slice(0, -1)
dataAreas = dataAreas7.split(',')
console.log(dataWeek)

const dataTonosChart7 = {
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
      categories: dataAreas,
      labels: {
        formatter: function (val) {
          return val
        }
      }
    },
    yaxis: {
      title: {
        text: 'Cantidad de Mensajes'
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

  const classes = useStyles();
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          Próximamente
        </GridItem>
       {/* <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Store />
              </CardIcon>
              <p className={classes.cardCategory}>Ahorros</p>
              <h1 className={classes.cardTitle}>$34,24</h1>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                Últimas 24 horas
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Accessibility />
              </CardIcon>
              <p className={classes.cardCategory}>Empleados</p>
              <h1 className={classes.cardTitle}>245</h1>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Update />
                 Recientemente Actualizado
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <Icon>info_outline</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Burnout</p>
              <h1 className={classes.cardTitle}>45</h1>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <LocalOffer />
                Un 20% de Empleados con estres laboral.
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="success">
              <ChartistGraph
                className="ct-chart"
                data={dailySalesChart.data}
                type="Line"
                options={dailySalesChart.options}
                listener={dailySalesChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Productividad</h4>
              <p className={classes.cardCategory}>
                <span className={classes.successText}>
                  <ArrowUpward className={classes.upArrowCardCategory} /> 55%
                </span>{" "}
                incremento en la última semana.
              </p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> Campaña semanal
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="warning">
              <ChartistGraph
                className="ct-chart"
                data={emailsSubscriptionChart.data}
                type="Bar"
                options={emailsSubscriptionChart.options}
                responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                listener={emailsSubscriptionChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Emociones: Felicidad</h4>
              <p className={classes.cardCategory}>Evolución de la Felicidad en los Empleados</p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> Campaña semanal
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="warning">
              <ChartistGraph
                className="ct-chart"
                data={completedTasksChart.data}
                type="Line"
                options={completedTasksChart.options}
                listener={completedTasksChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Burnout</h4>
              <p className={classes.cardCategory}>Promedio general diario</p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> Campaña semanal
             </div>
            </CardFooter>
          </Card>
  </GridItem>*/}
       {/* <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="success">
              <h4 className={classes.cardTitleWhite}>Tonos de conversación en los últimos 7 días</h4>
            </CardHeader>
            <CardBody>
              <Chart options={dataTonosChart7.options} series={dataTonosChart7.series} type="area" height={250} />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="success">
              <h4 className={classes.cardTitleWhite}>Tonos de conversación por semana</h4>
            </CardHeader>
            <CardBody>
              <Chart options={dataTonosChart.options} series={dataTonosChart.series} type="area" height={250} />
            </CardBody>
          </Card>
</GridItem> */}
      </GridContainer>
    </div>
  );
}
