import React, { useEffect } from "react";
import useForm from "./useForm";
import { connect } from "react-redux";
import * as actions from "../../actions/team";
import ButterToast, { Cinnamon } from "butter-toast";
import { AssignmentTurnedIn } from "@material-ui/icons";
import { Grid, withStyles, TextField, Button, InputLabel } from "@material-ui/core";
import Card from "../Card/Card.js";
import CardHeader from "../Card/CardHeader.js";
import styles from "../../assets/jss/material-dashboard-react/views/dashboardStyle.js";
import CardBody from "../Card/CardBody.js";
import { makeStyles } from "@material-ui/core/styles";

const initialFieldValues = {
    name: '',
    area: '',
    description: '',
    teamNumber: ''
}

const useStyles = makeStyles(styles);

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

const TeamsForm = ({ classes, ...props }) => {

    useEffect(() => {
        if (props.currentId !== 0) {
            setValues({
                ...props.teamList.find(x => x._id === props.currentId)
            })
            setErrors({})
        }
    }, [props.currentId])// eslint-disable-line react-hooks/exhaustive-deps

    const validate = () => {
        let temp = { ...errors }
        temp.name = values.name ? "" : "Nombre requerido."
        temp.area = values.area ? "" : "Área requerida."
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
                content: <Cinnamon.Crisp title="Equipo"
                    content="Guardado correctamente"
                    scheme={Cinnamon.Crisp.SCHEME_PURPLE}
                    icon={<AssignmentTurnedIn />}
                />
            })
            resetForm()
        }
        if (validate()) {
            if (props.currentId === 0) {

                props.createTeam(values, onSuccess)
               /*  window.location.reload(false); */
            /*     delay(function () { */
            /*         window.location.reload(false); */
            /*     }, 500); // end delay */
            }
            else {
                props.updateTeam(props.currentId, values, onSuccess)
               /*  window.location.reload(false); */
            }
        }




    }

    const classes2 = useStyles();

    return (
        <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`}
            onSubmit={handleSubmit}>
            <Card>
                <CardHeader color="success">
                    <h4 className={classes2.cardTitleWhite}>Equipo </h4>
                </CardHeader>
                <CardBody>
                    <div style={{ alignItems: 'center', padding: '3px' }}>
                        <Grid container>
                            <Grid item xs={4}>
                                <InputLabel id="name">Equipo</InputLabel>
                                <TextField
                                    id="name"
                                    name="name"
                                    variant="standard"
                                    fullWidth
                                    value={values.name}
                                    onChange={handleInputChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    {...(errors.name && { error: true, helperText: errors.name })}
                                />
                            </Grid>
                            <Grid item xs={3}></Grid>
                            <Grid item xs={4}>
                                <InputLabel id="area">Área</InputLabel>
                                <TextField
                                    name="area"
                                    variant="standard"
                                    id="area"
                                    value={values.area}
                                    fullWidth
                                    onChange={handleInputChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    {...(errors.area && { error: true, helperText: errors.area })}
                                />
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
                    </div>
                </CardBody>
            </Card>

        </form>
    );
}


const mapStateToProps = state => ({
    teamList: state.team.list
})

const mapActionToProps = {
    createTeam: actions.create,
    updateTeam: actions.update
}


export default connect(mapStateToProps, mapActionToProps)(withStyles(styles2)(TeamsForm));