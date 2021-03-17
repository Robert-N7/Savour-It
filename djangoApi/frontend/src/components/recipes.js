import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getRecipesApi} from '../recipeApi';

/**
 * Displays multiple recipes
 */
class RecipesView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loaded: false,
            placeholder: "Loading",
            n_wide: 3
          };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    loadData() {
        // Call the Api to get list of recipes
        getRecipesApi().then((data) => {
            this.setState({
                    data,
                    loaded: true
            });
        }).catch(error => {
            console.log('Failed to get recipes');
            this.setState({
                placeholder: "Failed to load recipes"
            });
        });  
    }

    componentDidMount() {
        this.loadData()
        window.addEventListener('resize', this.updateWindowDimensions);
        this.updateWindowDimensions();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        let cols = window.innerWidth / 300;
        if(cols == 0)
            cols = 1;
        this.setState({ n_wide: cols});
    }

    render() {
        if(!this.state.data) {
            return (
                <div>It looks empty here, lets
                    <Link to={"/create/"}> add some recipes!</Link>
                </div>
            )
        } else {
        // array of N elements, where N is the number of rows needed
        const rows = [...Array( Math.ceil(this.state.data.length / this.state.n_wide) )];
        // chunk the recipes into the array of rows
        const recipeRows = rows.map( (row, idx) => this.state.data.slice(idx * this.state.n_wide, idx * this.state.n_wide + this.state.n_wide) );
        // map the rows as div.row
        return (
            <div className="recipes-view" defaultValue={this.placeholder}>
                {recipeRows.map((row, index) => {
                    return (
                        <div className="recipe-row" key={index}>
                        {row.map(recipe=>
                            <div className="recipe-item" key={recipe.RecipeId}>
                                <Link className="recipe-link" to={"/recipes/" + recipe.Name}>
                                    {recipe.ImageURL && <img className='recipe-small' src={recipe.ImageURL} alt={recipe.Name}/>}
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
}
export default RecipesView;
