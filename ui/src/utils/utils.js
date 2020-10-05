import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import React from "react";
import axios from "axios";
import Store from "../store/Store";
import {constants} from "./constants";


export function getInitials(userName){
    if (userName){
        return userName.split(' ').reduce((prev,curr,idx,arr)=>{
            if (idx === 0 || idx === arr.length-1){
                return prev + curr.substring(0,1).toUpperCase();
            }
            else {
                return prev;
            }
        },'');
    }
}


export function getHierarchy (list){
    const nodesMap = list.reduce((nodes, currentValue) => {
        currentValue.children = [];
        nodes[currentValue.id] = currentValue;
        return nodes;
    },{});

    const rootElement = list.find(node =>{
        if (!node.reply_to_id){
            return node;
        }
    });

    list.forEach(node => {
       const parent = node.reply_to_id;
       if (parent !== null) {
           if (nodesMap[parent]) {
               nodesMap[parent].children.push(node);
           }
           else {
               rootElement.children.push(node);
           }
       }
       else if (node !== rootElement){
           rootElement.children.push(node);
       }
    });



    return rootElement;
}

export function randomColor(){
    let hex = Math.floor(Math.random()*0xffffff);
    let color ='#'+hex.toString(16);
    return color;
}

export function stringToColour (str) {
    const colors = ["#e51c23", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#5677fc", "#03a9f4", "#00bcd4", "#009688", "#259b24", "#8bc34a", "#afb42b", "#ff9800", "#ff5722", "#795548", "#607d8b"]

    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    hash = ((hash % colors.length) + colors.length) % colors.length;
    return colors[hash];
}

export function formatDate(date) {
    if (date){
        // return format(new Date(date), 'dd/MM/yyyy');
        return new Date(date).toLocaleString();
    }
    return '';

}

export function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="#">
                Minerva
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export async function doSignIn(username, password){
    const postObj = {
        username: username,
        password: password
    };
    const response = await axios.post('/account/token', postObj);
    // console.log(response);
    localStorage.setItem('token',response.data.access);
    const userRes = await axios.get('/account/details', {
        headers:{
            authorization: 'Bearer ' + response.data.access
        }
    });
    // console.log(userRes);
    Store.setUser({
        [constants.userToken]:response.data.access,
        [constants.userName]:userRes.data.username,
        [constants.userID]:userRes.data.id
    });
}