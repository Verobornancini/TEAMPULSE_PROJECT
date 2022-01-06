import React, { useEffect, useState } from "react";
import useForm from "./useForm";
import { connect } from "react-redux";
import * as actions from "../../actions/employee";
import ButterToast, { Cinnamon } from "butter-toast";
import { AssignmentTurnedIn } from "@material-ui/icons";
import { Grid, withStyles, TextField, Button, InputLabel } from "@material-ui/core";
import styles from "../../assets/jss/material-dashboard-react/views/dashboardStyle.js";
import Card from "../Card/Card.js";
import { makeStyles } from "@material-ui/core/styles";
import CardHeader from "../Card/CardHeader.js";
import CardBody from "../Card/CardBody.js";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import NativeSelect from '@material-ui/core/NativeSelect';



const initialFieldValues = {
    firstName: '',
    lastName: '',
    email: '',
    area: '',
    legajo: '',
    equipo: ''
}

const styles2 = theme => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1)
        },
    },
    form: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    postBtn: {
        width: "50%"
    }
})

const useStyles = makeStyles(styles);


const EmployeesForm = ({ classes, ...props }) => {

    const [equipo, setEquipo] = useState('');


    useEffect(() => {
        if (props.currentId !== 0) {
            setValues({
                ...props.employeeList.find(x => x._id === props.currentId)
            })
            props.fetchAllTeams()
            setErrors({})
        }
    }, [props.currentId])// eslint-disable-line react-hooks/exhaustive-deps
    console.log(props.employeeList)
    const validate = () => {
        let temp = { ...errors }
        temp.firstName = values.firstName ? "" : "Nombre requerido."
        temp.lastName = values.lastName ? "" : "Apellido requerido."
        temp.equipo = values.equipo ? "" : "Equipo requerido."
        setErrors({
            ...temp
        })
        return Object.values(temp).every(x => x === "")
    }


    var {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFieldValues, props.setCurrentId)

    const handleSubmit = e => {
        e.preventDefault()
        const onSuccess = () => {
            ButterToast.raise({
                content: <Cinnamon.Crisp title="Empleado"
                    content="Guardado correctamente"
                    scheme={Cinnamon.Crisp.SCHEME_PURPLE}
                    icon={<AssignmentTurnedIn />}
                />
            })
            resetForm()
        }
        if (validate()) {
            if (props.currentId === 0) {
                props.createEmployee(values, onSuccess)
                /*  window.location.reload(false); */
                /*   delay(function () { */
                /*       window.location.reload(false); */
                /*   }, 500); // end delay */
            }
            else {
                props.updateEmployee(props.currentId, values, onSuccess)
                /*  window.location.reload(false); */
                /*  delay(function () { */
                /*      window.location.reload(false); */
                /*  }, 500); // end delay */
            }
        }

    }


    const handleChange = (event) => {
        console.log('event')
        console.log(event.target.value)
    };


    const classes2 = useStyles();


    return (
        <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`}
            onSubmit={handleSubmit}>
            <Card>
                <CardHeader color="success">
                    <h4 className={classes2.cardTitleWhite}>Empleado </h4>
                </CardHeader>
                <CardBody>
                    <Grid container>

                        <Grid item xs={4}>
                            <InputLabel id="firstName">Nombre</InputLabel>
                            <TextField
                                id="firstName"
                                name="firstName"
                                variant="standard"
                                fullWidth
                                value={values.firstName}
                                onChange={handleInputChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                {...(errors.firstName && { error: true, helperText: errors.firstName })}
                            />
                        </Grid>
                        <Grid item xs={3}></Grid>
                        <Grid item xs={4}>
                            <InputLabel id="lastName">Apellido</InputLabel>
                            <TextField
                                id="lastName"
                                name="lastName"
                                variant="standard"
                                value={values.lastName}
                                fullWidth
                                onChange={handleInputChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                {...(errors.lastName && { error: true, helperText: errors.lastName })}
                            />
                        </Grid>
                    </Grid>
                    <Grid container style={{ marginTop: '15px' }}>


                        <Grid item xs={6}>
                            <InputLabel id="email">Mail</InputLabel>
                            <TextField
                                name="email"
                                variant="standard"
                                id="email"
                                fullWidth
                                value={values.email}
                                placeholder="...@gmail.com"
                                onChange={handleInputChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                {...(errors.email && { error: true, helperText: errors.email })}
                            />
                        </Grid>
                        <Grid item xs={1}></Grid>
                       {/* <Grid item xs={4}>
                            <InputLabel id="equipo">Equipo</InputLabel>
                            <TextField
                                name="equipo"
                                variant="standard"
                                id="equipo"
                                fullWidth
                                value={values.equipo}
                                onChange={handleInputChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                {...(errors.equipo && { error: true, helperText: errors.equipo })}
                            />

                        </Grid>*/}
                        <Grid item xs={4}>
                            <InputLabel id="equipo_select">Equipo</InputLabel>
                            <NativeSelect
                                id="equipo"
                                value={values.equipo}
                                fullWidth
                                onChange={handleInputChange}
                                inputProps={{ readOnly: true }}
                                {...(errors.equipo && { error: true, helperText: errors.equipo })}
                            >       
                                    <option value={''}>Seleccione</option>
                                {props.teamList.map((record) => (
                                    <option key={record.name} value={record.name}>
                                        {record.name}
                                    </option>
                                ))}
                            </NativeSelect>
                        </Grid>
                    </Grid>


                    <Grid container>
                        <Grid item xs={4}></Grid>
                        <Grid item xs={6}>

                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                type="submit"
                                className={classes.postBtn}
                            >{props.currentId ? 'Guardar' : 'Crear'}</Button>
                        </Grid>
                    </Grid>
                </CardBody>
            </Card>
        </form >
    );
}


const mapStateToProps = state => ({
    employeeList: state.team.list,
    teamList: state.employee.list
})

const mapActionToProps = {
    createEmployee: actions.create,
    updateEmployee: actions.update,
    fetchAllTeams: actions.fetchAllTeams
}


export default connect(mapStateToProps, mapActionToProps)(withStyles(styles2)(EmployeesForm));