import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Api from '../axiosApi';

/**
 * Displays multiple recipes
 */
class RecipesView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loaded: false,
            placeholder: "Loading"
          };
    }

    loadData() {
        // Call the Api to get list of recipes
        Api.get('/recipes/').then((response) => {
            if(response.status > 400) {
                console.log('Failed to get recipes');
                return this.setState(() => {
                    return { placeholder: "Failed to load recipes" }
                });
            } else {
                const data = response.data
                return this.setState(() => {
                    return {
                        data,
                        loaded: true
                    }
                })
            }
        });  
    }

    componentDidMount() {
        this.loadData()
    }

    render() {
        // array of N elements, where N is the number of rows needed
        const rows = [...Array( Math.ceil(this.state.data.length / 4) )];
        // chunk the recipes into the array of rows
        const recipeRows = rows.map( (row, idx) => this.state.data.slice(idx * 4, idx * 4 + 4) );
        // map the rows as div.row
        return (
            <div className="recipes-view" defaultValue={this.placeholder}>
                {recipeRows.map((row, index) => {
                    return (
                        <div className="recipe-row" key={index}>
                        {row.map(recipe=>
                            <div className="recipe-item" key={recipe.RecipeId}>
                                <Link className="recipe-link" to={"/recipes/" + recipe.Name}>
                                    {recipe.ImageURL && <img src={recipe.ImageURL} alt={recipe.Name}/>}
                                    <div className="recipe-item-name">
                                        {recipe.Name}
                                    </div>
                                </Link>
                                <div className="recipe-item-desc">
                                    {recipe.Description}
                                </div>
                                <div className="small-italic">
                                   Added by {recipe.CreatorName}
                                </div>
                            </div>)}
                        </div>
                    )
                })}
            </div>
        )
    }
}
export default RecipesView;
