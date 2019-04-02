import axios from 'axios';
import { key } from '../config';

//This function constructor imports data from the API and stores the recipes 'result' property which is then exported to the global app
// controller and stored in the 'state' object in  index.js

export default class Search {
    constructor (query) {
        this.query = query;
    }
    async getResults() {
        
        try {
        const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
        this.result = res.data.recipes;
        //console.log(this.result);
        } catch (error) {
            alert(error);
        }
    }
}





