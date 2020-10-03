import React, {Component, useEffect} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from "../../data/axios";
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import Store from "../../store/Store";
import {constants} from '../../utils/constants';
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

const styles = (theme) => ({
    input: {
        borderColor: 'rgba(255, 255, 255, 0.7)',

        '&::endAdornment': {

        },
    },

    formLabelRoot:{
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingTop: '0.4em',
        "& .MuiInputBase-input":{ color: 'rgba(255, 255, 255, 0.7)'}
    },
});

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

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
            // const response =  await axios.get('hashtags');

            const response =  await axios.post('hashtags',{user_id: Store.user[constants.userID]},{
                headers:{
                    authorization: 'Bearer ' + Store.user[constants.userToken]
                },
            });
            const {data} = response;
            console.log('hashtags-data: ' ,data);
            if (active) {
                setOptions(Array.from(new Set(data.hashtags)));
            }
            if (data.hashtags.length === 0) {
                setOpen(false);
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

    const onChange = (e,value)=>{
        const hashtags = value.reduce((prev,current)=>{
            return [...prev,current];
        },[]);
        Store.setFilter({[constants.filterHashtag]:hashtags});
    }


    return (
        <Autocomplete
            multiple
            disableCloseOnSelect

            id="hashtag-filter"
            style={{ width: '100%',}}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            getOptionSelected={(option, value) => option === value}
            getOptionLabel={(option) => option}
            options={options}
            loading={loading}
            onChange={onChange}
            popoverProps={{ style: { width: 'auto'} }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Search Hashtag"
                   className={classes.formLabelRoot}
                    variant="filled"

                    InputLabelProps={{
                        style: {
                            color: '#009be5'
                        }
                    }}
                    InputProps={{
                        ...params.InputProps,
                        classes: { input: classes.input, adornedEnd:classes.adornedEnd},
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
            renderOption={(option, { inputValue,selected }) => {
                const matches = match(option, inputValue);
                const parts = parse(option, matches);

                return (
                    <div>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
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







