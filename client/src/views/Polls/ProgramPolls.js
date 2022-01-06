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
import * as actionsForms from "../../actions/typeformForms"

import styles from "../../assets/jss/material-dashboard-react/views/dashboardStyle.js";
import stylesTasks from "../../assets/jss/material-dashboard-react/components/tasksStyle.js";
import TextField from '@material-ui/core/TextField';

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
const ProgramPolls = ({ classes, ...props }) => {


  const classesTasks = useStylesTasks();
  const [checked, setChecked] = useState([]);
  const handleToggle = value => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };
  const tasksIndexes = [0];
  const { rtlActive } = props;
  const tableCellClasses = classnames(classesTasks.tableCell, {
    [classesTasks.tableCellRTL]: rtlActive
  });
  /*  */
  /*   const date = new Date(); */
  /*   var dateStr = */
  /*     date.getFullYear() + "-" + */
  /*     ("00" + (date.getMonth() + 1)).slice(-2) + "-" + */
  /*     ("00" + date.getDate()).slice(-2) + "T" + */
  /*     ("00" + date.getHours()).slice(-2) + ":" + */
  /*     ("00" + date.getMinutes()).slice(-2); */
  /*  */



  const handleSubmit = e => {
    e.preventDefault()
    const onSuccess = () => {
      console.log('onSuccess')
    }
    props.sendPolls(checked, onSuccess)
    console.log('submit')

  }


 /*  useEffect(() => { */
 /*    if (props.typeformForms()) { */
 /*      props.typeformForms() */
 /*    } */
 /*  }, [])// eslint-disable-line react-hooks/exhaustive-deps */

 /*  console.log(props.typeformForms) */

  const classesPoll = useStyles();
  const classes2 = useStyles2();
  return (
    <div>

      <form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Card>
          <CardHeader color="warning">
            <h4 className={classesPoll.cardTitleWhite}>Envio de Encuestas</h4>
          </CardHeader>
          <Grid container>
            <Grid item xs={6}>

              <CustomTabs
                title="Selección de Encuestas"
                headerColor="warning"
                tabs={[
                  {
                    tabName: "Todas",
                    tabIcon: LibraryBooks,
                    /*    tabContent: ( */
                    /*      <Tasks */
                    /*        checkedIndexes={[]} */
                    /*        tasksIndexes={[0, 1, 2, 3]} */
                    /*        tasks={encuestas} */
                    /*      /> */
                    /*    ) */
                    tabContent: (
                      <Table className={classesTasks.table}>
                        <TableBody>
                          {tasksIndexes.map(value => (
                            <TableRow key={value} className={classesTasks.tableRow}>
                              <TableCell className={tableCellClasses}>
                                <Checkbox
                                  checked={checked.indexOf(value) !== -1}
                                  tabIndex={-1}
                                  onClick={() => handleToggle(value)}
                                  checkedIcon={<Check className={classesTasks.checkedIcon} />}
                                  icon={<Check className={classesTasks.uncheckedIcon} />}
                                  classes={{
                                    checked: classesTasks.checked,
                                    root: classesTasks.root
                                  }}
                                />
                              </TableCell>
                              <TableCell className={tableCellClasses}>{encuestas[value]}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )
                  }
                ]}
              />

            </Grid>
            {/* <Grid item xs={4}>
              <InputLabel id="fechaenvio" className={classes2.textInput}>Fecha de Envio</InputLabel>
              <TextField
                id="fechaenvio"
                type="datetime-local"
                variant="standard"
                fullWidth
                defaultValue={dateStr}
                className={classes2.textField}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {/*  </form>
            </Grid> */}

          </Grid>
          <CardFooter>
            <Grid container>
              <Grid item xs={10}>
              </Grid>
              <Grid item xs={2}>
                <Button color="success" type="submit">Enviar</Button>
              </Grid>
            </Grid>
          </CardFooter>
        </Card>
      </form>
    </div >
  );

}

const mapStateToProps = state => ({
  typeformForms: state.typeformForms.list
})

const mapActionToProps = {
  sendPolls: actions.create,
  typeformForms: actionsForms.fetchAll
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles2)(ProgramPolls));

