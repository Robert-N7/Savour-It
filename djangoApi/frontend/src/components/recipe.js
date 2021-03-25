
import React, { Component } from "react";
import { Link } from 'react-router-dom';
import Api from "../axiosApi";
import {getRecipeApi} from "../recipeApi";
import {getLastOfUrl} from "../lib/url";

/**
 * Recipe class for Displaying recipes
 */
class Recipe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loaded: false,
            placeholder: "Loading..."
          };
    }

    loadData() {
        // Call the api and load recipe data
        getRecipeApi(getLastOfUrl()).then(data => {
            this.setState({
                    data,
                    loaded: true
                });
            return data;
        })
        .catch(error => {
            console.log('Page not found, redirecting to recipes');
            this.props.history.push('/recipes');
        })
    }

    componentDidMount() {
        this.loadData()
    }

    newLineText(props) {
        return <div className="new-line">{props.text}</div>
    }

    render() {
        const recipe = this.state.data
        if(recipe)
        return (
            <div className="recipe" defaultValue={this.state.placeholder}>
                <div className="inline">
                    <div className="recipe_name">
                        <h1>{recipe.Name}</h1>
                    </div>
                    {Api.user == recipe.CreatorName && <Link className="recipe-link" to={"/edit/" + recipe.Name}>
                        <div className="recipe-item-name">
                            Edit
                        </div>
                    </Link>}
                    <div className="recipe_desc">
                        <this.newLineText text={recipe.Description} />
                    </div>
                    <div>
                        <div className="small-italic">Added {recipe.CreationDate} by {recipe.CreatorName}</div>
                    </div>
                    <div className="ingredients">
                        <h2 className="recipe-header">Ingredients</h2>
                        <this.newLineText text={recipe.Ingredients} />
                    </div>
                    <div className="steps">
                        <h2 className="recipe-header">Steps</h2>
                        <this.newLineText text={recipe.Steps} />
                    </div>
                </div>
                {recipe.ImageURL && 
                    <div className="inline"><img className="recipe-large" src={recipe.ImageURL} alt={recipe.Name}/></div>}
            </div>
        )
        else 
            return <div>{this.state.placeholder}</div>
    }
}
export default Recipe
