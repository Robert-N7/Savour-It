import React, { Component } from "react";
import Api from "../axiosApi";

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
            photoFile: null
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
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
            const response = await Api.post('/recipes/create/', data = data);
            return response;
        } catch (error) {
            console.log(error);
            // todo
            return error;
        }        
    }

    /**
     * Handles submitting the form by sending data to server
     * @param {*} event 
     */
    handleSubmit(event) {
        event.preventDefault();
        let data = {
            'Name': this.state.name,
            'Description': this.state.description,
            'Ingredients': this.state.ingredients,
            'Steps': this.state.steps
        
        }
        // upload file and data
        if(this.state.photoFile) {
            const formData = new FormData();
            formData.append('PhotoFile', this.state.photoFile, this.state.photoFile.name);
            Api.post('/recipes/upload/', formData, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }).then((response) => {
                data['PhotoFile'] = response.data[0];
                console.log(data['PhotoFile']);
                return this.postJson(data);
            }).catch((error) => {
                // todo, file upload failed message
            })    
        }
        // upload data no file 
        else {
            this.postJson(data);
        }
    }

    handleImageChange(event) {
        this.setState({photoFile: event.target.files[0]});
    }

    render() {
        return (
            <div className="centered">
                <div className="form">
                    <h2>Add your recipe here!</h2>
                    <form onSubmit={this.handleSubmit} encType="multipart/form-data">
                        <div className="form-item">
                            <input name="name" type="text" value={this.state.name} onChange={this.handleChange} placeholder="Recipe Name"/>
                        </div>
                        <div className="form-item">
                            <textarea name="description" value={this.state.description} onChange={this.handleChange} placeholder="Description:"/>
                        </div>
                        <div className="form-item">
                            <textarea name="ingredients" value={this.state.ingredients} onChange={this.handleChange} placeholder="Ingredients:"/>
                        </div>
                        <div className="form-item">
                            <textarea name="steps" value={this.state.steps} onChange={this.handleChange} placeholder="Steps:"/>
                        </div>
                        <div className="form-item">
                            <label>
                                Photo:
                                <input type="file" name="img" accept="image/png,image/jpg" onChange={this.handleImageChange}/>
                            </label>
                        </div>
                        <div className="form-item">
                            <input type="submit"  value="Create!"/>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
export default CreateRecipe