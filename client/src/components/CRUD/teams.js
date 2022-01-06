import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions/team";
import { Grid, Paper, withStyles, Button } from "@material-ui/core";
import ButterToast, { Cinnamon } from "butter-toast";
import { DeleteSweep } from "@material-ui/icons";
import TeamsForm from "./teamsForm"
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import styles from "../../assets/jss/material-dashboard-react/views/dashboardStyle.js";
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from "@material-ui/core/styles";
import Modal from '@material-ui/core/Modal';
import Card from "../Card/Card.js";
import CardHeader from "../Card/CardHeader.js";
import CardBody from "../Card/CardBody.js";
import Tooltip from "@material-ui/core/Tooltip";

const styles2 = theme => ({
    paper: {
        margin: theme.spacing(3),
        padding: theme.spacing(2)
    },
    smMargin: {
        margin: theme.spacing(1)
    },
    actionDiv: {
        textAlign: "center"
    },
    modal: {
        display: 'flex',
        padding: theme.spacing(2),
        alignItems: 'center',
        justifyContent: 'center',
        width: '60%',
        margin: '25%'
    }
})

const useStyles = makeStyles(styles);

const Teams = ({ classes, ...props }) => {
    //const {classes, ...props} = props
    const [currentId, setCurrentId] = useState(0)
    const [open, setOpen] = useState(false);

    useEffect(() => {
        props.fetchAllTeams()
    }, [])// eslint-disable-line react-hooks/exhaustive-deps

    const onDelete = id => {
        const onSuccess = () => {
            ButterToast.raise({
                content: <Cinnamon.Crisp title="Equipo"
                    content="Eliminado correctamente"
                    scheme={Cinnamon.Crisp.SCHEME_PURPLE}
                    icon={<DeleteSweep />}
                />
            })
        }
        if (window.confirm('¿Seguro quiere eliminar este equipo?'))
            props.deleteTeam(id, onSuccess)
    }

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const setCurrentId2 = id => {
        handleOpen()
        setCurrentId(id)
    }

    const classes2 = useStyles();

    return (
        <Grid container>
            <Grid container>
                <Card>
                    <CardHeader color="success">
                        <h4 className={classes2.cardTitleWhite}>Equipos</h4>
                    </CardHeader>
                    <CardBody>
                        <Grid item xs={12}>
                            <TableContainer component={Paper}>
                                <Table className={classes.table} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                           {/*  <TableCell align="left">Nro. Equipo</TableCell> */}
                                            <TableCell>Equipo</TableCell>
                                            <TableCell align="left">Área</TableCell>
                                            {/*    <TableCell align="left">Descripción</TableCell> */}
                                            <TableCell align="center">Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {props.teamList.map((record, index) => (
                                            <TableRow key={record.Name}>
                                               {/*  <TableCell align="left">{record.teamNumber}</TableCell> */}
                                                <TableCell component="th" scope="row">
                                                    {record.name}
                                                </TableCell>
                                                <TableCell align="left">{record.area}</TableCell>
                                                {/*   <TableCell align="left">{record.description}</TableCell> */}
                                                <TableCell align="center">
                                                    <Grid container className={classes.actionDiv}>
                                                        <Grid item xs={5}>
                                                            <Fab size="small" color="primary" aria-label="editar">
                                                                <Tooltip
                                                                    title="Editar equipo"
                                                                    placement="top"
                                                                >
                                                                    <EditIcon className={classes.smMargin} id="edit_team"
                                                                        onClick={() => setCurrentId2(record._id)} />
                                                                </Tooltip>
                                                            </Fab>
                                                            {/* <Button variant="contained" color="primary" size="small" 
                                                     className={classes.smMargin} 
                                                     onClick={() => setCurrentId(record._id)}> */}
                                                            {/*     Edit */}
                                                            {/* </Button> */}
                                                        </Grid>
                                                        <Grid item xs={2}>

                                                        </Grid>
                                                        <Grid item xs={4}>
                                                            <Fab size="small" color="secondary" aria-label="eliminar">
                                                                <Tooltip
                                                                    title="Eliminar equipo"
                                                                    placement="top"
                                                                >
                                                                    <DeleteIcon className={classes.smMargin}
                                                                        onClick={() => onDelete(record._id)} />
                                                                </Tooltip>
                                                            </Fab>
                                                            {/* <Button variant="contained" color="secondary" size="small" 
                                                     className={classes.smMargin} 
                                                     onClick={() => onDelete(record._id)}> */}
                                                            {/*     Delete */}
                                                            {/*  </Button> */}
                                                        </Grid>
                                                    </Grid>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid container align="right" style={{ marginTop: "10px" }}>


                            <Grid item xs={12} >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    type="submit"
                                    marginBottom="3px"
                                    className={classes.postBtn}
                                    onClick={() => handleOpen()}
                                >Nuevo</Button>
                            </Grid>
                        </Grid>
                    </CardBody>
                </Card>
            </Grid>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                className={classes.modal}
            >
                <TeamsForm {...{ currentId, setCurrentId }} />
            </Modal>
        </Grid>







    );
}

const mapStateToProps = state => ({
    teamList: state.team.list
})

const mapActionToProps = {
    fetchAllTeams: actions.fetchAll,
    deleteTeam: actions.Delete
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles2)(Teams));
