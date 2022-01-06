import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import CardAvatar from "../../components/Card/CardAvatarLogin.js";
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import logoTpulse from '../../assets/img/logoTPulse.png';
import Paper from '@material-ui/core/Paper';



function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="www.teampulse.ai">
                TeamPulse
      </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '80%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    }
}));

const baseUrl = 'http://' + window.location.hostname + ':8080/login'
async function loginUser(credentials) {
    return fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
}

export default function LoginForm({ setToken }) {
    const classes = useStyles();

    const [details, setDetails] = useState({ username: "", password: "" });
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState('')

    /*  const submitHandler = e => { */
    /*      e.preventDefault(); */

    /*      setToken(details) */
    /*  } */

    const handleSubmit = async e => {
        e.preventDefault();
        if (username.toLowerCase() === 'admin' && password === '1234') {
            const token = await loginUser({
                username,
                password
            });
            setError('');
            setToken(token);
        } else {
            setError('Error al loguearse!')
        }
    }


    return (
        <Container component="main" maxWidth="xs">
            <Paper >
                <CssBaseline />
                <div className={classes.paper}>
                    <CardAvatar profile>
                        <img src={logoTpulse} alt="..." />
                    </CardAvatar>
                    <Typography component="h2" variant="h6">
                        ¡Bienvenido!
                         </Typography>
                    <form className={classes.form} noValidate onSubmit={handleSubmit}>
                        <TextField

                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="usuario"
                            label="Usuario"
                            name="usuario"
                            autoComplete="usuario"
                            autoFocus
                            // onChange={e => setDetails({ ...details, username: e.target.value })}
                            onChange={e => setUserName(e.target.value)}
                            value={username}
                        />
                        <TextField

                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Contraseña"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            // onChange={e => setDetails({ ...details, password: e.target.value })}
                            onChange={e => setPassword(e.target.value)}
                            value={password}
                        />
                        {(error !== "") ?
                            <Typography component="h5" variant="h7">
                                {error}
                            </Typography>
                            : ""}
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Recordar usuario"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Ingresar
                     </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    ¿Olvidó su contraseña?
                            </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
                <Box mt={2}>
                    <Copyright />
                </Box>
            </Paper>
        </Container>

    );
}

LoginForm.propTypes = {
    setToken: PropTypes.func.isRequired
};