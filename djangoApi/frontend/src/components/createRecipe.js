import React, { Component } from "react";
import {uploadPhotoApi, createRecipeApi} from "../recipeApi";

/**
 * Create Recipe form
 */
class CreateRecipe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            description: "",
            ingredients: "",
            steps: "",
            photoFile: null,
            errMessage: null
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.validateName = this.validateData.bind(this);
        this.create = this.create.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    /**
     * Posts the json data to create recipe
     * @param {json request data} data 
     */
    async postJson(data) {
        try {
            const response = await createRecipeApi(data);
            this.props.history.push('/recipes/recipe/' + this.state.name);
            return response;
        } catch (error) {
            if(error === 409) {
                this.setState({errMessage: "Sorry, a recipe already exists with that name."});
            } else
                this.setState({errMessage: "That didn't work"});
            Promise.reject(error);
        }        
    }

    /**
     * Checks that fields are not null
     * @param {*} data 
     */
    validateData(data) {
        if(!data.Name) {
            this.setState({errMessage: "Please provide a name for your recipe"})
        } else if(!data.Ingredients) {
            this.setState({errMessage: "Ingredients are required!"});
        } else if(!data.Steps) {
            this.setState({errMessage: "Please add steps"});
        } else {
            this.setState({errMessage: ""});
            return true;
        }
        return false;
    }

    /**
     * Creates the recipe
     */
    create() {
        let data = {
            'Name': this.state.name,
            'Description': this.state.description,
            'Ingredients': this.state.ingredients,
            'Steps': this.state.steps        
        }
        if(!this.validateData(data))
            return null;
        // upload file
        if(this.state.photoFile) {
            const formData = new FormData();
            formData.append('PhotoFile', this.state.photoFile, this.state.photoFile.name);
            uploadPhotoApi(formData)
            .then((response) => {
                data.PhotoFile = response;
                this.postJson(data);
            }).catch((error) => {
                this.setState({errMessage: "Failed to upload file, are you sure it is the correct format?"});
                return error;
            })    
        } else {
        // upload data
            this.postJson(data)
        }
    }

    /**
     * Handles submitting the form by sending data to server
     * @param {*} event 
     */
    handleSubmit(event) {
        event.preventDefault();
        this.create();
    }

    handleImageChange(event) {
        this.setState({photoFile: event.target.files[0]});
    }

    render() {
        return (
            <div className="centered">
                <div className="form">
                    {this.state.errMessage && <div className='err' id="err">{this.state.errMessage}</div>}
                    <h2>Add your recipe here!</h2>
                    <form onSubmit={this.handleSubmit} encType="multipart/form-data">
                        <div className="form-item">
                            <input name="name" type="text" id="recipe-name" value={this.state.name} onChange={this.handleChange} placeholder="Recipe Name"/>
                        </div>
                        <div className="form-item">
                            <textarea className="large-ta" name="description" id="description" value={this.state.description} onChange={this.handleChange} placeholder="Description:"/>
                        </div>
                        <div className="form-item">
                            <textarea className="large-ta" name="ingredients" id="ingredients" value={this.state.ingredients} onChange={this.handleChange} placeholder="Ingredients:"/>
                        </div>
                        <div className="form-item">
                            <textarea className="large-ta" name="steps" id="steps" value={this.state.steps} onChange={this.handleChange} placeholder="Steps:"/>
                        </div>
                        <div className="form-item">
                            <label>
                                Photo:
                                <input type="file" id="photo-file" name="img" accept="image/png,image/jpeg" onChange={this.handleImageChange}/>
                            </label>
                        </div>
                        <div className="form-item">
                            <input type="submit" id="submit" value="Create!"/>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
export default CreateRecipe;