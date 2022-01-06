// ##############################
// // // javascript library for creating charts
// #############################
var Chartist = require("chartist");

// ##############################
// // // variables used to create animation on charts
// #############################
var delays = 80,
  durations = 500;
var delays2 = 80,
  durations2 = 500;

// ##############################
// // // Daily Sales
// #############################

const dailySalesChart = {
  data: {
    labels: ["L", "M", "M", "J", "V"],
    series: [[70, 78, 60, 89, 73]]
  },
  options: {
    lineSmooth: Chartist.Interpolation.cardinal({
      tension: 0
    }),
    low: 0,
    high: 100, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
    chartPadding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  },
  // for animation
  animation: {
    draw: function (data) {
      if (data.type === "line" || data.type === "area") {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path
              .clone()
              .scale(1, 0)
              .translate(0, data.chartRect.height())
              .stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === "point") {
        data.element.animate({
          opacity: {
            begin: (data.index + 1) * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: "ease"
          }
        });
      }
    }
  }
};

// ##############################
// // // Email Subscriptions
// #############################

const emailsSubscriptionChart = {
  data: {
    labels: ["L", "M", "M", "J", "V"
    ],
    series: [[50, 45, 32, 78, 55]]
  },
  options: {
    axisX: {
      showGrid: false
    },
    low: 0,
    high: 100,
    chartPadding: {
      top: 0,
      right: 10,
      bottom: 0,
      left: 0
    },
  },
  responsiveOptions: [
    [
      "screen and (max-width: 640px)",
      {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function (value) {
            return value[0];
          }
        }
      }
    ]
  ],
  animation: {
    draw: function (data) {
      if (data.type === "bar") {
        data.element.animate({
          opacity: {
            begin: (data.index + 1) * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: "ease"
          }
        });
      }
    }
  }
};

// ##############################
// // // Completed Tasks
// #############################

const completedTasksChart = {
  data: {
    labels: ["L", "M", "M", "J", "V"],
    series: [[23, 45, 55, 33.5,24]]
  },
  options: {
    lineSmooth: Chartist.Interpolation.cardinal({
      tension: 0
    }),
    low: 0,
    high: 100, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
    chartPadding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  },
  animation: {
    draw: function (data) {
      if (data.type === "line" || data.type === "area") {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path
              .clone()
              .scale(1, 0)
              .translate(0, data.chartRect.height())
              .stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === "point") {
        data.element.animate({
          opacity: {
            begin: (data.index + 1) * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: "ease"
          }
        });
      }
    }
  }
};

const dataChart = {

  series: [{
    name: 'Ventas',
    data: [80, 50, 30, 40, 45],
  }, {
    name: 'Desarrollo',
    data: [20, 30, 40, 80, 20],
  }, {
    name: 'Finanzas',
    data: [44, 76, 78, 13, 43],
  }],
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
    markers: {
      size: 2
    },
    xaxis: {
      categories: ['Tristeza', 'Alegría', 'Miedo', 'Angustia', 'Enfado']
    }
  },


};

const horizontalChart = {

  series: [{
    name: 'Positivo',
    data: [53, 22, 40, 40]
  }, {
    name: 'Neutral',
    data: [30, 40, 30, 20]
  }, {
    name: 'Negativo',
    data: [17, 38, 30, 21]
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
      },
    },
    stroke: {
      width: 1,
      colors: ['#fff']
    },
    xaxis: {
      /* categories: ['Positivo', 'Neutro', 'Negativo'], */
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
    fill: {
      opacity: 1
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 40
    }
  },


};

const dataChartPersonal = {

  series: [{
    name: 'Juan Fernandez',
    data: [40, 78, 30, 40, 45],
  }],
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
    markers: {
      size: 2
    },
    xaxis: {
      categories: ['Tristeza', 'Alegría', 'Miedo', 'Angustia', 'Enfado']
    }
  },


};

const hzlChartPersonal = {

  series: [{
    name: 'Positivo',
    data: [30]
  }, {
    name: 'Neutral',
    data: [53]
  }, {
    name: 'Negativo',
    data: [17]
  }],
  options: {
    chart: {
      barHeight: '100%',
      barWidth: '50%',
      type: 'bar',
      height: 350,
      stacked: true,
      stackType: '100%'
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '20%',
      },
    },
    stroke: {
      width: 1,
      colors: ['#fff']
    },
    xaxis: {
      categories: ['Juan Fernandez'],
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
    colors:['#00E396', '#FEB019', '#FF4560', '#E91E63', '#FF9800'],
    fill: {
      opacity: 1
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 40
    },
    
  },


};

const personalProd = {
  series: [{
    name: 'Productividad',
    data: [31, 40, 67, 51]
  }, {
    name: 'BurnOut',
    data: [11, 32, 45, 32]
  }],
  options: {
    chart: {
      height: 350,
      type: 'area',
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      type: 'string',
      categories: ["Mayo", "Junio", "Julio", "Agosto"]
    },
  },


};

const hitosProd = {
  series: [{
    name: 'Productividad',
    data: [31, 40, 67, 51]
  }, {
    name: 'BurnOut',
    data: [11, 32, 30, 25]
  }, {
    name: 'Ejercicios en el trabajo',
    data: [0, 42,0 ,0 ]
  }, {
    name: 'Trabajos con metodologías agiles',
    data: [0, 0, 52, 0]
  }],
  options: {
    chart: {
      height: 350,
      type: 'area',
      stacked: false,
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    colors:['#00E396', '#FF4560', '#FEB019', '#2B908F','#008FFB', '#775DD0'],
    xaxis: {
      type: 'string',
      categories: ["Mayo", "Junio", "Julio", "Agosto"]
    },
  },


};


module.exports = {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart,
  dataChart,
  horizontalChart,
  dataChartPersonal,
  hzlChartPersonal,
  personalProd,
  hitosProd
};
