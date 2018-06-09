import { observable } from 'mobx';


class Store{

    @observable drawer = null;

}


const store = new Store();
export default store;