import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import withStyles from "@material-ui/core/styles/withStyles";
import Grow from "@material-ui/core/Grow";
import Zoom from "@material-ui/core/Zoom";
import Slide from "@material-ui/core/Slide";

const styles = () => ({
    hide:{
        display: 'none'
    }
})

function RadioButtonsGroup(props) {
    const date = new Date();
    date.setDate(date.getDate() -7);
    const [selectedFromDate, setSelectedFromDate] = React.useState(new Date(date));
    const [selectedToDate, setSelectedToDate] = React.useState(new Date());
    const [disabled, setDisabled] = React.useState(true);
    const [exited, setExited] = React.useState(false);

    const  {classes} =props;

    const onDateFromChange = (date) => {
        setSelectedFromDate(date);
    };

    const onDateToChange = (date) => {
        setSelectedToDate(date);
        if (selectedFromDate > date){
            setSelectedFromDate(date);
        }
    };

    const onChange = (event) => {
        event.target.value === 'custom'?
            setDisabled(false):
            setDisabled(true);
    };

    return (
        <FormControl component="fieldset">
            <RadioGroup aria-label="TimeFilter" name="timeFilter" defaultValue={"all"}  onChange={onChange}>
                <FormControlLabel value="all" control={<Radio  color={"primary"} />} label="All" />
                <FormControlLabel value="today" control={<Radio color={"primary"}/>} label="Today" />
                <FormControlLabel value="lastWeek" control={<Radio color={"primary"}/>} label="Last Week" />
                <FormControlLabel value="lastMonth"  control={<Radio color={"primary"}/>} label="Last Month" />
                <FormControlLabel value="custom"  control={<Radio color={"primary"}/>} label="Custom Range" />
            </RadioGroup>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Slide
                    direction="right"
                    mountOnEnter
                    unmountOnExitZoom
                    in={!disabled}
                    timeout={2000}

                >
                    <Grid container justify="space-around"  >
                        <KeyboardDatePicker
                            disabled={disabled}
                            autoOk
                            InputAdornmentProps={{ position: "start" }}
                            variant="inline"
                            format="dd/MM/yyyy"
                            maxDate={selectedToDate}
                            maxDateMessage={'From Date should be Before To Date'}
                            margin="normal"
                            id="date-picker-inline"
                            label="From Date:"
                            value={selectedFromDate}
                            onChange={onDateFromChange}
                            InputLabelProps={{
                                style: {
                                    color: '#009be5'
                                }
                            }}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                                style: {
                                    color: 'rgba(255, 255, 255, 0.7)'
                                }
                            }}
                            InputProps={{
                                style: {
                                    color: 'rgba(255, 255, 255, 0.7)'
                                }
                            }}
                        />
                        <KeyboardDatePicker
                            disabled={disabled}
                            autoOk
                            InputAdornmentProps={{ position: "start" }}
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            maxDate={Date.now()}
                            id="date-picker-inline"
                            label="To Date:"
                            value={selectedToDate}
                            onChange={onDateToChange}
                            InputLabelProps={{
                                style: {
                                    color: '#009be5'
                                }
                            }}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                                style: {
                                    color: 'rgba(255, 255, 255, 0.7)'
                                }
                            }}
                            InputProps={{
                                style: {
                                    color: 'rgba(255, 255, 255, 0.7)'
                                }
                            }}
                        />
                    </Grid>
                </Slide>
            </MuiPickersUtilsProvider>
        </FormControl>
    );
}

export default withStyles(styles)(RadioButtonsGroup);

