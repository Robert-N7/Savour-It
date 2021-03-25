import React, { Component } from "react";
import {uploadPhotoApi, editRecipeApi, getRecipeApi} from "../recipeApi";
import {getLastOfUrl} from "../lib/url";

/**
 * Edit Recipe form
 */
class EditRecipe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            errMessage: null,
            placeholder: "Loading...",
            isLoaded: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.validateName = this.validateData.bind(this);
        this.create = this.editRecipe.bind(this);
        this.loadData = this.loadData.bind(this);
    }

    componentDidMount() {
        this.loadData()
    }

    loadData() {
        getRecipeApi(getLastOfUrl()).then(data => {
            console.log(data);
            this.setState({
                    data,
                    isLoaded: true
                });
            this.nameInput.value = data.Name;
            this.descInput.value = data.Description;
            this.ingInput.value = data.Ingredients;
            this.stepsInput.value = data.Steps;
            return data;
        })
        .catch(error => {
            console.log('Page not found, redirecting to recipes');
            this.props.history.push('/recipes');
        })
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
            const response = await editRecipeApi(data);
            this.props.history.push('/recipes/recipe/' + this.state.data.Name);
            return response;
        } catch (error) {
            if(error === 403) {
                this.setState({errMessage: "Sorry, you aren't the recipe's creator."});
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
     * Updates the recipe
     */
    editRecipe() {
        let data = {
            'Name': this.nameInput.value,
            'Description': this.descInput.value,
            'Ingredients': this.ingInput.value,
            'Steps': this.stepsInput.value        
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
        this.editRecipe();
    }

    handleImageChange(event) {
        this.setState({photoFile: event.target.files[0]});
    }

    render() {
        const data = this.state.data;
        if(data)
            return (
                <div className="centered">
                    <div className="form">
                        {this.state.errMessage && <div className='err' id="err">{this.state.errMessage}</div>}
                        <h2>Update your recipe here!</h2>
                        <form onSubmit={this.handleSubmit} encType="multipart/form-data">
                            <div className="form-item">
                                <input name="name" type="text" id="recipe-name" onChange={this.handleChange} placeholder="Recipe Name" ref={nameInput => (this.nameInput = nameInput)}/>
                            </div>
                            <div className="form-item">
                                <textarea className="large-ta" name="description" id="description" onChange={this.handleChange} placeholder="Description:" ref={descInput => (this.descInput = descInput)}/>
                            </div>
                            <div className="form-item">
                                <textarea className="large-ta" name="ingredients" id="ingredients" onChange={this.handleChange} placeholder="Ingredients:" ref={ingInput => (this.ingInput = ingInput)}/>
                            </div>
                            <div className="form-item">
                                <textarea className="large-ta" name="steps" id="steps" onChange={this.handleChange} placeholder="Steps:" ref={stepsInput => (this.stepsInput = stepsInput)}/>
                            </div>
                            <div className="form-item">
                                {data.ImageURL && <div className="inline"><img className="recipe-small" src={data.ImageURL} alt={data.Name}/></div>}
                                <label>
                                    Photo:
                                    <input type="file" id="photo-file" name="img" accept="image/png,image/jpeg" onChange={this.handleImageChange}/>
                                </label>
                            </div>
                            <div className="form-item">
                                <input type="submit" id="submit" value="Update!"/>
                            </div>
                        </form>
                    </div>
                </div>
            )
        else
            return (
                <div>{this.state.placeholder}</div>
            )
    }
}
export default EditRecipe;