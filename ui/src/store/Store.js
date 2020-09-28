import {observable, action, toJS, computed} from 'mobx';
import {constants} from "../utils/constants";

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
        [constants.userID]: 1,
        [constants.userFirstName]: 'moshe',
        [constants.userLastName]: 'zuchmer'
    };

    @action setUser(userAttrib){
        this.user=Object.assign({},this.user, userAttrib);
        console.log('user update:', toJS(this.user));
    }

    @computed get userFullName(){
        return `${this.user[constants.userFirstName]} ${this.user[constants.userLastName]}`;
    }
    // @observable discussions = [];
    //
    // @observable commentsRootElement = null;
    //
    // @observable commentsLoading = false;
    // @observable commentsInitiated = false;
    //
    // @observable isShowAllCommentsDisabled = false;
    // @observable isCommentsExpanded = false;
    //
    // @action setIsCommentsExpanded (isExpanded){
    //     this.isCommentsExpanded = isExpanded;
    // }
    //
    // @action setIsShowAllCommentsDisabled (isDisabled){
    //     this.isShowAllCommentsDisabled = isDisabled;
    // }
    //
    // @action setCommentsBehaviour (loading, initiated){
    //     this.commentsInitiated = initiated;
    //     this.commentsLoading = loading;
    // }
    //
    //
    //
    // @action setCommentsRootElement(element=null){
    //     this.commentsRootElement = element;
    // }
    //
    // @action setDiscussions(discussionList){
    //     this.discussions = discussionList;
    // }
    //
    // @computed get numDiscussions (){
    //     return this.discussions.length;
    // }
}

export default new Store();

