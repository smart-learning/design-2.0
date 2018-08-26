import axios from 'axios';

export default axios.create({
	adapter: require('axios/lib/adapters/xhr'),
});