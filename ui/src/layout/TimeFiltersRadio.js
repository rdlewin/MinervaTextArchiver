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
import Store from "../store/Store";
import {constants} from "../utils/constants";

const styles = () => ({
    hide:{
        display: 'none'
    },
    root:{
        color: 'rgba(255, 255, 255, 0.7)'
    },

})

function RadioButtonsGroup(props) {
    const date = new Date();
    date.setDate(date.getDate() -7);
    const [selectedFromDate, setSelectedFromDate] = React.useState(new Date(date));
    const [selectedToDate, setSelectedToDate] = React.useState(new Date());
    const [disabled, setDisabled] = React.useState(true);
    const [exited, setExited] = React.useState(false);

    const  {classes} =props;

    const onDateFromChange = (dateFrom) => {
        setSelectedFromDate(dateFrom);

        Store.setFilter({
            [constants.filterTimeFrom]: dateFrom,
            [constants.filterTimeTo]: selectedToDate
        });
    };

    const onDateToChange = (dateTo) => {
        setSelectedToDate(dateTo);
        let dateFrom = selectedFromDate;
        if (selectedFromDate > dateTo){
            setSelectedFromDate(dateTo);
            dateFrom = dateTo;
        }

        Store.setFilter({
            [constants.filterTimeFrom]: dateFrom,
            [constants.filterTimeTo]: dateTo
        });
    };

    const onChange = (event) => {
        let timeFrom = new Date();
        let timeTo = new Date();
        switch (event.target.value){
            case constants.radioToday:
                timeFrom = timeTo;
                break;
            case constants.radioLastWeek:
                timeFrom.setDate(timeFrom.getDate() - 7);
                break;
            case constants.radioLastMonth:
                timeFrom.setMonth(timeFrom.getMonth() - 1);
                break;
            case constants.radioCustom:
                timeTo = selectedToDate;
                timeFrom = selectedFromDate;
                break;
            default: //All
                timeTo = null;
                timeFrom = null;
                break;
        }
        const timeFilter = {

        }
        Store.setFilter({
            [constants.filterTimeFrom]: timeFrom,
            [constants.filterTimeTo]: timeTo
        });

        event.target.value === constants.radioCustom?
            setDisabled(false):
            setDisabled(true);
    };

    return (
        <FormControl component="fieldset">
            <RadioGroup aria-label="TimeFilter" name="timeFilter" defaultValue={constants.radioAll}  onChange={onChange}>
                <FormControlLabel value={constants.radioAll} control={<Radio  color={"primary"} className={classes.root} />} label={constants.radioAll} />
                <FormControlLabel value={constants.radioToday} control={<Radio color={"primary"} className={classes.root}/>} label={constants.radioToday} />
                <FormControlLabel value={constants.radioLastWeek} control={<Radio color={"primary"} className={classes.root}/>} label={constants.radioLastWeek} />
                <FormControlLabel value={constants.radioLastMonth}  control={<Radio color={"primary"} className={classes.root}/>} label={constants.radioLastMonth} />
                <FormControlLabel value={constants.radioCustom}  control={<Radio color={"primary"} className={classes.root}/>} label={constants.radioCustom} />
            </RadioGroup>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Slide
                    direction="right"
                    mountOnEnter
                    unmountOnExit
                    in={!disabled}
                    timeout={1000}

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
                            id="date-picker-From"
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
                            id="date-picker-To"
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

