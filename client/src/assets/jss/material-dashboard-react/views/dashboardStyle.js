import {
  successColor,
  whiteColor,
  grayColor,
  hexToRgb
} from "../../material-dashboard-react.js";
import tooltipStyle from "../tooltipStyle.js";

const dashboardStyle = {
  ...tooltipStyle,
  successText: {
    color: successColor[0]
  },
  upArrowCardCategory: {
    width: "16px",
    height: "16px"
  },
  stats: {
    color: grayColor[0],
    display: "inline-flex",
    fontSize: "12px",
    lineHeight: "22px",
    "& svg": {
      top: "4px",
      width: "16px",
      height: "16px",
      position: "relative",
      marginRight: "3px",
      marginLeft: "3px"
    },
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      top: "4px",
      fontSize: "16px",
      position: "relative",
      fontFamily: "sans-serif",
      marginRight: "3px",
      marginLeft: "3px"
    }
  },
  statsPolls: {
    display: "inline-flex",
    fontSize: "15px",
    lineHeight: "22px",
    "& svg": {
      top: "4px",
      width: "16px",
      height: "16px",
      position: "relative",
      marginRight: "3px",
      marginLeft: "3px"
    },
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      top: "4px",
      fontSize: "16px",
      position: "relative",
      fontFamily: "sans-serif",
      marginRight: "3px",
      marginLeft: "3px"
    }
  },
  cardCategory: {
    color: grayColor[0],
    margin: "0",
    fontSize: "14px",
    fontFamily: "sans-serif",
    marginTop: "0",
    paddingTop: "10px",
    marginBottom: "0"
  },
  cardCategoryWhite: {
    color: "rgba(" + hexToRgb(whiteColor) + ",.62)",
    margin: "0",
    fontSize: "14px",
    fontFamily: "sans-serif",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitle: {
    color: grayColor[2],
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: grayColor[1],
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  typo: {
    fontFamily: "sans-serif",
  },
  modal: {
    display: 'flex',
    padding: '5px',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardTitleWhite: {
    color: whiteColor,
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    /* fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif", */
    fontFamily: "sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: grayColor[1],
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  cardTitleWhiteCenter: {
    color: whiteColor,
    alignItems: "center",
    alignText: "center",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    /* fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif", */
    fontFamily: "sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: grayColor[1],
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

export default dashboardStyle;
