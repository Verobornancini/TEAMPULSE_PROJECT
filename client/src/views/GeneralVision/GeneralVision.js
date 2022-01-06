import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tabletop from "tabletop";
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";
import Chart from 'react-apexcharts'
import CardIcon from "../../components/Card/CardIcon.js";
import styles from "../../assets/jss/material-dashboard-react/views/dashboardStyle.js";
import CardFooter from "../../components/Card/CardFooter.js";
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import * as actions from '../../actions/generalVision';
import axios from "axios";

/* const baseUrl = 'http://localhost:8080/' */

const baseUrl = 'http://' + window.location.hostname + ':8080/'
//const baseUrl = process.env.REACT_APP_SERVER_URL //'http://100.26.46.75:8080/'


const useStyles = makeStyles(styles);



export default function Dashboard() {



  const [dataGeneral, setDataGeneral] = useState([])
  const [dataGeneral2, setDataGeneral2] = useState([])
  useEffect(() => {
    /* actions.fetchAll() */
    var url = baseUrl + 'generalVision'
    axios.get(url)
      /* .then(res => res.json()) */
      .then(
        (result) => {
          /*  setIsLoaded(true); */
          setDataGeneral2(result.data);
          setDataGeneral(result.data)
        },
        (error) => {
          console.log(error)
        }
      )
  }, [])

  console.log(dataGeneral2)
  console.log(dataGeneral2.polarity)

 /*  useEffect(() => { */
 /*    Tabletop.init({ */
 /*      key: "1FZKRHB103jrg3sYQX4G4_NUKneMN6EDK_8T0aum7XBY", //semanal */
 /*      simpleSheet: true */
 /*    }) */
 /*      .then((data) => setDataGeneral(data)) */
 /*      .catch((err) => console.warn(err)); */
 /*  }, []); */


  console.log(dataGeneral.polarity)

  var polarity = '';
  var subjectivity = '';

  var note_global = dataGeneral.map((data) => {
    polarity = data.polarity;
    subjectivity = data.subjectivity;
  });

  console.log('---')
  console.log(polarity)
  console.log(subjectivity)

  const dataTonosChart7 = {
    series: [{
      name: 'Positivo',
      data: '1'
    }, {
      name: 'Neutral',
      data: '2'
    }, {
      name: 'Negativo',
      data: '3'
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
        curve: 'smooth',
        stackType: '1%'
      },
      xaxis: {
        categories: '1',
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

  var polaritychart = (polarity.replace(',', '.')) * 100;

  const dataPolarity = {
    series: [polaritychart],
    options: {
      chart: {
        type: 'radialBar',
        offsetY: -20,
        sparkline: {
          enabled: true
        }
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: "#e7e7e7",
            strokeWidth: '97%',
            margin: 5, // margin is in pixels
            dropShadow: {
              enabled: true,
              top: 2,
              left: 0,
              color: '#999',
              opacity: 1,
              blur: 2
            }
          },
          dataLabels: {
            name: {
              show: true,
              fontSize: '22px',
              color: '#2E294E'
            },
            value: {
              show: false,
              offsetY: -2,
              fontSize: '22px'
            }
          }
        }
      },
      colors: ['#775DD0'],
      grid: {
        padding: {
          top: -10
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          shadeIntensity: 0.4,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 53, 91]
        },
      },
      labels: [(polaritychart / 100).toFixed(2).toString()],
    },


  };


  var subjetivitychart = (subjectivity.replace(',', '.')) * 100;
  const dataSubjetivity = {
    series: [subjetivitychart],
    options: {
      chart: {
        type: 'radialBar',
        offsetY: -20,
        sparkline: {
          enabled: true
        }
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: "#e7e7e7",
            strokeWidth: '97%',
            margin: 5, // margin is in pixels
            dropShadow: {
              enabled: true,
              top: 2,
              left: 0,
              color: '#999',
              opacity: 1,
              blur: 2
            }
          },
          dataLabels: {
            name: {
              show: true,
              fontSize: '22px',
              color: '#2E294E'
            },
            value: {
              show: false,
              offsetY: -2,
              fontSize: '22px'
            }
          }
        }
      },
      grid: {
        padding: {
          top: -10
        }
      },
      colors: ['#775DD0'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          shadeIntensity: 0.4,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 53, 91]
        },
      },
      labels: [(subjetivitychart / 100).toFixed(2).toString()],
    },
  };


  const classes = useStyles();
  return (
    <div>
      <Card>
        <CardHeader color="success" >
          <h3 className={classes.cardTitleWhiteCenter}>Niveles de intencionalidad en las conversaciones de Slack</h3>
          <p className={classes.cardTitleWhiteCenter}>Medición de la calidad en la comunicación.</p>
          {/*  <h1 className={classes.cardTitle}>{polarity}</h1> */}
        </CardHeader>
        <GridContainer>
          <GridItem xs={12} sm={6} md={6}>
            <Card>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                  <EmojiPeopleIcon />
                </CardIcon>
                <h3 className={classes.cardTitle}>Polaridad</h3>
                <p className={classes.cardCategory}>Mide que tan positiva o negativa es una frase.</p>
                {/*  <h1 className={classes.cardTitle}>{polarity}</h1> */}
              </CardHeader>
              <CardBody>
                <Chart options={dataPolarity.options} series={dataPolarity.series} type="radialBar" />
              </CardBody>
              <CardFooter stats>
                <div className={classes.stats}>
                  0: Negatividad <br /> 1: Positividad
               </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={6}>
            <Card>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                  <EmojiPeopleIcon />
                </CardIcon>
                <h3 className={classes.cardTitle}>Subjetividad</h3>
                <p className={classes.cardCategory}> Mide que tan objetiva o subjetiva es una frase.</p>
                {/* <h1 className={classes.cardTitle}>{subjectivity}</h1> */}
              </CardHeader>
              <CardBody>
                <Chart options={dataSubjetivity.options} series={dataSubjetivity.series} type="radialBar" />
              </CardBody>
              <CardFooter stats>
                <div className={classes.stats}>
                  0: Objetividad (hechos) <br /> 1: Subjetividad (opiniones).
               </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </Card>
    </div>
  );
}
