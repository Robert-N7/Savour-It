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
            photoFileName: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        try {
            Api.post('/create/', {
                Name: this.state.name,
                Description: this.state.description,
                Ingredients: this.state.ingredients,
                Steps: this.state.steps,
                PhotoFileName: this.state.photoFileName,
            }).then((response) => {
                return response;
            })
        }
        catch(error) {
            throw error;
        }
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
                                <input type="file" name="img" accept="image/*"/>
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