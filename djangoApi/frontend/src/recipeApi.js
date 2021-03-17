import React from 'react';
import Api from './axiosApi';

/***
 * Recipe Apis
 */

async function getRecipesApi() {       // Call the Api to get list of recipes
    try {
        let response = await Api.get('/recipes/');
        return response.data;
    } catch(error) {
        Promise.reject(error);

    }
}

async function getRecipeApi(recipe) {
    try {
        let response = await Api.get('/recipes/recipe/' + recipe);
        return response.data;    
    } catch(error) {
        Promise.reject(error.response.status);
    }
}

async function createRecipeApi(data) {
    try {
        let response = await Api.post('/recipes/create/', data = data);
        return response.data;
    } catch (error){
        console.log('Status: ' + error.response.status);
        Promise.reject(error.response.status);
    }
}

async function uploadPhotoApi(formData) {
    try {
        let response = await Api.post('/recipes/upload/', formData, { 
            headers: {
                'content-type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error){
        Promise.reject(error.response.status);
    }
}

export {getRecipesApi, getRecipeApi, createRecipeApi, uploadPhotoApi};