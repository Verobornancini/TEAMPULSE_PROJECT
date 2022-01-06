import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import avatar from "assets/img/Juan-Fernandez.png";
import RadarChart from 'react-apexcharts'
import {
  dataChartPersonal,
  hzlChartPersonal,
  personalProd
} from "variables/charts.js";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

const useStyles = makeStyles(styles);


export default function PersonalVision() {
  const classes = useStyles();
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <a href="#pablo" onClick={e => e.preventDefault()}>
                <img src={avatar} alt="..." />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h6 className={classes.cardCategory}>Finanzas - Gerente</h6>
              <h4 className={classes.cardTitle}>Juan Fernandez</h4>
              <p className={classes.description}>
                Realiza tareas administrativas y financieras, tiene un equipo a cargo.
              </p>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="success">
              <h4 className={classes.cardTitleWhite}>Evolución</h4>
            </CardHeader>
            <CardBody>
              <RadarChart options={personalProd.options} series={personalProd.series} type="area" height={250} />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Tonos y emociones</h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CardBody>
                    <RadarChart options={dataChartPersonal.options} series={dataChartPersonal.series} type="radar" height={300} />
                  </CardBody>
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CardBody>
                    <RadarChart options={hzlChartPersonal.options} series={hzlChartPersonal.series} type="bar" height={300} />
                  </CardBody>
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
