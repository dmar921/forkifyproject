import { elements } from './base';
import { create } from 'domain';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

const limitRecipeTitle = (title, limit = 17) => {
    /*
    'pasta with tomato and spinach'
    acc 0 / acc + cur.length = 5 / newTitle = ['Pasta',]
    acc 5 / acc + cur.length = 9 / newTitle = ['Pasta', 'with']
    acc 9 / acc + cur.length = 15 / newTitle = ['Pasta', 'with', 'tomato'
    */
    if (title.length > limit) {
        const newTitle = [];
        title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        //return the result
        return `${newTitle.join(' ')} ...`;
    }
    return title;
}

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

//type can either be 'prev' or 'next'. 
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>    
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>  
    </button>    
`;


const renderButtons = (page, numResults, resPerPage) => {
    const totalPages = Math.ceil(numResults / resPerPage);

    let button;
    if (page === 1 && totalPages > 1) {
        //only button to go to next page
        button = createButton(page, 'next');
    } else if (page < totalPages) {
        // both buttons should be visible
        button = `
        ${createButton(page, 'prev')};
        ${createButton(page, 'next')};
        `

    } else if (page === totalPages && totalPages > 1) {
        // only a button to go to prev page
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);

};

export const renderResults = (recipes, pages = 1
    , resPerPage = 10) => {
    //render results of current page
    const start = (pages - 1) * resPerPage; 
    const end = pages * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    //render pagination buttons
    renderButtons(pages, recipes.length, resPerPage);
};