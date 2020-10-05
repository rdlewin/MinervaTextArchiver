import axios from 'axios';


const instanceDev = axios.create({
   baseURL: 'http://localhost:8080/'
});

const instance = axios.create({
   baseURL: '/webapp/',

});

export default instance;