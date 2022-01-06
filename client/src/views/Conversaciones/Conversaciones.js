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
import logo from "../../assets/img/logobn-3.png"


const useStyles = makeStyles(styles);

export default function Dashboard() {
  const classes = useStyles();
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>

        </GridItem>
        <GridItem xs={12} sm={6} md={6}>
          <img src={logo} alt="logo" />
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
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
