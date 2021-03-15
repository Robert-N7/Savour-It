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
        return (
            <div className="recipes-view" defaultValue={this.placeholder}>
                {this.state.data.map((recipe, index) => {
                    index = index % 4;
                    return (
                            <div className="recipe-item item{index}" key={recipe.RecipeId}>
                                <Link className="recipe-link" to={"/recipes/" + recipe.Name}>
                                    <img src={recipe.PhotoFile} alt={recipe.Name}/>
                                    <div className="recipe-item-name">
                                        {recipe.Name}
                                    </div>
                                </Link>
                                <div className="recipe-item-desc">
                                    {recipe.Description}
                                </div>
                                <div className="small-italic">
                                    {recipe.CreatorName}
                                </div>
                            </div>
                    )
                })}
            </div>
        )
    }
}
export default RecipesView;
