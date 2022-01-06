import React from 'react';
import PropTypes from 'prop-types';
import './Crud.css';
import { Provider } from "react-redux";
import { store } from "../../actions/store";
import { Container, AppBar, Typography, Tab, Tabs, Box, makeStyles } from "@material-ui/core";
/* import ButterToast, { POS_RIGHT, POS_TOP } from "butter-toast"; */
import Employees from "../../components/CRUD/Employees"
import Teams from "../../components/CRUD/teams"

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `wrapped-tab-${index}`,
    'aria-controls': `wrapped-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));



function Crud() {

  const classes = useStyles();
  const [value, setValue] = React.useState('employees');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Provider store={store}>
      <Container maxWidth="lg">
        <AppBar position="static" color="inherit">
          <Typography
            variant="h2"
            align="center">
            Administración
          </Typography>
        </AppBar>
        <div className={classes.root}>
          <AppBar position="static">
            <Tabs value={value} onChange={handleChange} aria-label="wrapped label tabs example">
              <Tab
                value="employees"
                label="Empleados"
                wrapped
                {...a11yProps('employees')}
              />
              <Tab value="teams" label="Equipos" {...a11yProps('teams')} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index="employees">
            <Employees />
          </TabPanel>
          <TabPanel value={value} index="teams">
            <Teams />
          </TabPanel>
        </div>
      </Container>
    </Provider>
  );
}

export default Crud;
