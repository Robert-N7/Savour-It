
import React, { Component } from "react";
import Api from "../axiosApi";

/**
 * Recipe class for Displaying recipes
 */
class Recipe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loaded: false,
            placeholder: "Loading"
          };
    }

    loadData() {
        // Call the api and load recipe data
        const thePath = window.location.pathname;
        let urlPieces = thePath.split('/');
        let lastItem = urlPieces.pop();
        if(!lastItem)
            lastItem = urlPieces.pop()
        Api.get('/recipes/recipe/' + lastItem)
            .then(response => {
                if (response.status > 400) {
                    console.log('Failed to find recipe ' + lastItem)
                    return this.setState(() => {
                        return { placeholder: "Something went wrong!" };
                    });
                }
                return response.data;
              })
              .then(data => {
                this.setState(() => {
                    return {
                        data,
                        loaded: true
                    };
                });
              });
    }

    componentDidMount() {
        this.loadData()
    }

    newLineText(props) {
        return <div className="new-line">{props.text}</div>
    }

    render() {
        const recipe = this.state.data
        return (
            <div className="recipe" defaultValue={this.state.placeholder}>
                <div className="inline">
                    <div className="recipe_name">
                        <h1>{recipe.Name}</h1>
                    </div>
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
                    <div className="inline"><img className="pad" src={recipe.ImageURL} alt={recipe.Name}/></div>}
            </div>
        )
    }
}
export default Recipe
