import React, {Component, useEffect} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from "../data/axios";
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

const styles = (theme) => ({
    input: {
        borderColor: 'rgba(255, 255, 255, 0.7)',
        '&::placeholder': {

        },
    },
    formLabelRoot:{
        "& .MuiInputBase-input":{ color: 'rgba(255, 255, 255, 0.7)'}
    },
});

function HashtagFilter (props) {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const loading = open && options.length === 0;
    const  {classes} =props;

    React.useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            const response =  await axios.get('hashtags');

            const {data} = response;

            if (active) {
                setOptions(data);
            }
        })();

        return () => {
            active = false;
        };
    }, [loading]);

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    return (
        <Autocomplete
            id="asynchronous-demo"
            style={{ width: '100%' }}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            getOptionSelected={(option, value) => option.hashtag === value.hashtag}
            getOptionLabel={(option) => option.hashtag}
            options={options}
            loading={loading}

            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Search Hashtag"
                   className={classes.formLabelRoot}
                    variant="outlined"

                    InputLabelProps={{
                        style: {
                            color: '#009be5'
                        }
                    }}
                    InputProps={{
                        ...params.InputProps,
                        classes: { input: classes.input},
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
            renderOption={(option, { inputValue }) => {
                const matches = match(option.hashtag, inputValue);
                const parts = parse(option.hashtag, matches);

                return (
                    <div>
                        {parts.map((part, index) => (
                            <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                {part.text}
              </span>
                        ))}
                    </div>
                );
            }}
        />
    );
}

export default withStyles(styles)(HashtagFilter);







