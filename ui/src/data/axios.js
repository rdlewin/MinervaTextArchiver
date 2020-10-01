import axios from 'axios';
import Store from "../store/Store";
import {constants} from "../utils/constants";

const instanceDev = axios.create({
   baseURL: 'http://localhost:8080/'
});

const instance = axios.create({
   baseURL: '/webapp/',

});

export default instance;