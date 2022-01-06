import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import FormLabel from '@material-ui/core/FormLabel';


const useStyles = makeStyles(theme => ({
    root: {
        width: 300 + 24 * 2,
        padding: 24
    },
    margin: {
        height: theme.spacing(1)
    }
}));

const PrettoSlider = withStyles({
    root: {
        color: "#a2df77",
        height: 8
    },
    thumb: {
        height: 24,
        width: 24,
        backgroundColor: "#fff",
        border: "2px solid currentColor",
        marginTop: -8,
        marginLeft: -12,
        "&:focus,&:hover,&$active": {
            boxShadow: "inherit"
        }
    },
    active: {},
    valueLabel: {
        left: "calc(-50% + 4px)"
    },
    track: {
        height: 8,
        borderRadius: 4
    },
    rail: {
        height: 8,
        borderRadius: 4
    }
})(Slider);

const slideEmployees = ({ label, value, setValue, minValue, maxValue, stepValue, defaultValue }) => {
    //const classes = useStyles();
    return (
        <div style={{ paddingLeft: '2%', paddingRight: '2%', paddingTop: '3%' }}>
            <FormLabel gutterBottom >{label}: {value}</FormLabel>
            <PrettoSlider
                style={{ paddingTop: '3%' }}
                valueLabelDisplay="auto"
                aria-label="pretto slider"
                defaultValue={defaultValue}
                min={minValue}
                max={maxValue}
                step={stepValue}
                value={value}
                onChange={(event, v) => {
                    setValue(v);
                }}
            />
        </div>
    );
};
export default slideEmployees;