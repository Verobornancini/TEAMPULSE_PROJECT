import React, { useEffect } from "react";
import SlideEmployees from "components/Slider/SlideEmployees.js";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

const GreenRadio = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        paddingTop: '10',
    },
    paper: {
        padding: theme.spacing(0),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

function CustomizedSlider() {


    const [valueRadio, setValueRadio] = React.useState('mexico');
    const [value, setValue] = React.useState(50);

    const handleChange = (event) => {
        setValueRadio(event.target.value);
        console.log(event.target.value)
    };

    var MPR;
    var totalEmployees;
    var employees;
    var daysLosted;
    var hoursLosted;
    var persIMS;
    var perdidas;
    var persPerd;
    var costoAnual;
    var costoInd;
    var trimestralCost;
    var quarterlyPayment;
    var annualPayment;
    var currancy;


    useEffect(() => {
        console.log("Slider value: " + value);
    }, [value]);

    if (valueRadio == 'mexico') {

        MPR = 4 * 40 * 12;
        totalEmployees = value;
        employees = totalEmployees * 0.75;
        daysLosted = employees * 24;
        hoursLosted = 0.2 * (MPR * employees);
        persIMS = 20382910;
        perdidas = 16000000000;
        persPerd = perdidas / persIMS;
        /* costoAnual = (employees * persPerd) * 1.5; */
        costoAnual = (employees * 15500) / 12.9;
        costoInd = 4.5;
        trimestralCost = (value * costoInd) * 3;
        quarterlyPayment = ((trimestralCost) * 2) * 0.92;
        annualPayment = (trimestralCost * 4 * 0.8);
        currancy = '$';
        costoAnual = Math.round(costoAnual).toFixed();
        costoAnual = Intl.NumberFormat("de-DE").format(costoAnual);
        costoInd = Intl.NumberFormat("de-DE").format(costoInd);
        trimestralCost = Intl.NumberFormat("de-DE").format(trimestralCost)
        quarterlyPayment = Intl.NumberFormat("de-DE").format(quarterlyPayment)
        annualPayment = Intl.NumberFormat("de-DE").format(annualPayment)
    } else if (valueRadio == 'argentina') {

        MPR = 4 * 40 * 12;
        totalEmployees = value;
        employees = totalEmployees * 0.48;
        daysLosted = employees * 23;
        hoursLosted = 0.2 * (MPR * employees);
        persIMS = 20382910;
        perdidas = 16000000000;
        persPerd = perdidas / persIMS;
        /* costoAnual = (employees * persPerd) * 1.5; */
        costoAnual = (employees) * 1710;
        costoInd = 4.5;
        trimestralCost = (value * costoInd) * 3;
        quarterlyPayment = ((trimestralCost) * 2) * 0.92;
        annualPayment = (trimestralCost * 4 * 0.8);
        currancy = '$';
        costoAnual = Math.round(costoAnual).toFixed();
        costoAnual = Intl.NumberFormat("de-DE").format(costoAnual);
        costoInd = Intl.NumberFormat("de-DE").format(costoInd);
        trimestralCost = Intl.NumberFormat("de-DE").format(trimestralCost)
        quarterlyPayment = Intl.NumberFormat("de-DE").format(quarterlyPayment)
        annualPayment = Intl.NumberFormat("de-DE").format(annualPayment)
    } else if (valueRadio == 'espana') {

        MPR = 4 * 40 * 12;
        totalEmployees = value;
        employees = totalEmployees * 0.42;
        daysLosted = employees * 21;
        hoursLosted = 0.2 * (MPR * employees);
        persIMS = 20382910;
        perdidas = 16000000000;
        persPerd = perdidas / persIMS;
        /* costoAnual = (employees * persPerd) * 1.5; */
        costoAnual = employees * 1800;
        costoInd = 3.99;
        trimestralCost = (value * costoInd) * 3;
        quarterlyPayment = ((trimestralCost) * 2) * 0.92;
        annualPayment = (trimestralCost * 4 * 0.8);
        costoAnual = Math.round(costoAnual).toFixed();
        costoAnual = Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(costoAnual);
        costoInd = Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(costoInd);
        trimestralCost = Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(trimestralCost)
        quarterlyPayment = Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(quarterlyPayment)
        annualPayment = Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(annualPayment)
    }

    employees = Math.round(employees).toFixed();
    daysLosted = Math.round(daysLosted).toFixed();
    hoursLosted = Math.round(hoursLosted).toFixed();


    const classes = useStyles();
    return (
        <div>
            <FormControl component="fieldset">
                <FormLabel component="legend" style={{ paddingLeft: '5%', paddingTop: '5%' }}>País</FormLabel>
                <RadioGroup row aria-label="gender" name="pais" value={valueRadio} onChange={handleChange}>
                    <FormControlLabel value="argentina" control={<GreenRadio />} labelPlacement="start" label="Argentina" />
                    <FormControlLabel value="espana" control={<GreenRadio />} labelPlacement="start" label="España" />
                    <FormControlLabel value="mexico" control={<GreenRadio />} labelPlacement="start" label="México" />
                </RadioGroup>
            </FormControl>
            <SlideEmployees label="Cantidad de Empleados" value={value} setValue={setValue} minValue={25} maxValue={10000} stepValue={5} defaultValue={50} />
            <div className={classes.root} style={{ paddingTop: '30px' }}>
                <Grid container spacing={4}>
                    <Grid item xs={4}>
                        <div container className={classes.paper}>
                            <h4 className="employees">{employees}</h4>
                            <h4 className={classes.titule}>Empleados con estrés laboral </h4>
                        </div>
                    </Grid>
                    <Grid item xs={4}>
                        {/* <Paper className={classes.paper}> */}
                        <div container className={classes.paper}>
                            <h4 className="lostDays">{daysLosted}</h4>
                            <h4 style={classes.titule}>Número de días perdidos anuales por estrés laboral, depresión y ansiedad</h4>
                        </div>
                        {/* </Paper> */}
                    </Grid>
                    {/* <Grid item xs={4}>
                        <Paper className={classes.paper}>
                            <h4 className={classes.titule}>Horas perdidas por baja productividad</h4>
                            <span className="hoursLost">{hoursLosted}</span>
                        </Paper>
                    </Grid> */}
                    <Grid item xs={4}>
                        <div container className={classes.paper}>
                            <h4 className="annualCost">{currancy}{costoAnual}</h4>
                            <h4 className={classes.titule}>Coste anual por problemas relacionados a la salud mental, absentismo laboral y productividad {valueRadio == 'espana' ? '' : '(*)'}</h4>
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={12}>
                    <Grid item xs={12}>
                        <div container className={classes.paper}>
                            <h4 className="trimestralCost">{currancy}{costoInd}</h4>
                            <h4 className={classes.titule}>Coste mensual de la licencia por empleado {valueRadio == 'espana' ? '' : '(*)'}</h4>
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={4}>
                    <Grid item xs={4}>
                        <div container className={classes.paper}>
                            <h4 className="trimestralCost">{currancy}{trimestralCost}</h4>
                            <h4 className={classes.titule}>Costo licencia {valueRadio == 'espana' ? '' : '(*)'}</h4>
                        </div>
                    </Grid>
                    <Grid item xs={4}>
                        <div container className={classes.paper}>
                            <h4 className="quarterlyPayment">{currancy}{quarterlyPayment}</h4>
                            <h4 className={classes.titule}>Pago trimestral {valueRadio == 'espana' ? '' : '(*)'}</h4>
                        </div>
                    </Grid>
                    <Grid item xs={4}>
                        <div container className={classes.paper}>
                            <h4 className="annualPayment">{currancy}{annualPayment}</h4>
                            <h4 className={classes.titule}>Pago anual {valueRadio == 'espana' ? '' : '(*)'}</h4>
                        </div>
                    </Grid>
                </Grid>
                {valueRadio == 'espana' ? '' :

                    <Grid container spacing={12} style={{ alignItems: 'center' }}>
                        <div container className={classes.paper}>
                            <h9>(*) Valores expresados en dolares.</h9>
                        </div>
                    </Grid>
                }
            </div>
        </div >);
}

export default CustomizedSlider;