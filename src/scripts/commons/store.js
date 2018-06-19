import React from 'react';
import { observable } from 'mobx';

class Store{
    drawer = null;

	@observable auth = undefined;

}


const store = new Store();
export default store;