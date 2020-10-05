import {observable, action, toJS, computed} from 'mobx';
import {constants} from "../utils/constants";
import axios from 'axios';

class Store{
    @observable filters = {
       [constants.filterGroup] : []
    };

    @action setFilter(newFilter){
        this.filters = Object.assign({},this.filters, newFilter);
        console.log('filter update:', toJS(this.filters));
        console.log(JSON.stringify(toJS(this.filters)));

    }

    @observable lastUpdate ;
    @action setLastUpdate(update){
        this.lastUpdate = update;

    }

    @observable user = {
        [constants.userID]: '',
        [constants.userName]: '',
        [constants.userToken]: localStorage.getItem('token')
    };

    @action setUser(userAttrib){
        this.user=Object.assign({},this.user, userAttrib);
        console.log('user update:', toJS(this.user));
    }

   @computed get signedIn (){
        return this.user[constants.userToken]? true : false;
   }

   @action signOut(){
       localStorage.removeItem('token');
       this.user={
           [constants.userID]: '',
           [constants.userName]: '',
           [constants.userToken]: null
       }
       window.location.replace('/')
   }
   @action async validate(){
        if (this.signedIn){
            try {
                const userRes = await axios.get('/account/details', {
                    headers: {
                        authorization: 'Bearer ' + this.user[constants.userToken]
                    }
                })

                console.log('inside validate');
                this.setUser({
                    [constants.userName]: userRes.data.username,
                    [constants.userID]: userRes.data.id
                });
            }
            catch (e) {

            }


        }
   }

}

export default new Store();

