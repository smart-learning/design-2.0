import { observable } from 'mobx';

export default function( obj ) {
	return observable( obj );
};