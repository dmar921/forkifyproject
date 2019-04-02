import Search from './models/Search';
import Recipe from './models/Recipes';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

/*
Global State of the app
* - Search Object
* - current recipe object
* - shopping list object
* - liked recipes
*/
const state = {};

const controlSearch = async () => {
    // 1) get query from view
    const query = searchView.getInput();
    

    if(query) {
        // 2) create a new search object and add to state
        state.search = new Search(query);

        // 3) prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        try {
            // 4) Search for recipes
            await state.search.getResults();

            // 5. Render results on the UI
            clearLoader();
            searchView.renderResults(state.search.result);

        } catch (err) {
            clearLoader();
            alert ('something went wrong with the search');
        }
        
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});


elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/*
Recipe Controller
*/
const controlRecipe = async () => {
    
    //get ID from URL
    const id = window.location.hash.replace('#','');;
    console.log(id);

    if (id) {
        // prepare UI for changes

        // create new recipe object
        state.recipes = new Recipe(id);


        try {
            //get recipe data and paarse ingredients
            await state.recipes.getRecipe();
            state.recipes.parseIngredients();

            // calculate servings and time
            state.recipes.calcTime();
            state.recipes.calcServings();

            // render recipe
            console.log(state.recipes);
        } catch (err) {
            alert('Error processing recipe.');
        }
    }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));





