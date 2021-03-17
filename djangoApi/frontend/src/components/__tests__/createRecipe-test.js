import React from 'react';
import {screen, render, fireEvent, queryByAttribute, queryByRole} from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateRecipe from '../createRecipe';
import EleWrapper from '../test-lib/ele-wrapper';
import { createRecipeApi, uploadPhotoApi} from '../../recipeApi';

jest.mock('../../recipeApi');


/**
 * Sets up the create recipe form and returns EleWrapper
 * @param {*} name 
 * @param {*} description 
 * @param {*} steps 
 * @param {*} ingredients 
 * @param {*} photoFile 
 */
function setupForm(name, description, steps, ingredients) {
    const wrapper = new EleWrapper(<CreateRecipe/>);
    wrapper.formFill({
        'recipe-name': name, 
        'description': description,
        'steps': steps,
        'ingredients': ingredients,
    })
    return wrapper;
}


describe('<CreateRecipe/>', () => {
    describe('Submit Form', () => {
        it('It should fail if no name is provided', () => {
            const comp = setupForm('', 'A tasty lasagna', '1. Cook it.', 'Cheese\nHamburger\netc...');
            expect(createRecipeApi).toHaveBeenCalledTimes(0);
        })

        it('It should submit form without image successfully', () => {
            jest.mock('../../recipeApi');
            const comp = setupForm('Lasagna', 'A tasty lasagna', '1. Cook it.', 'Cheese\nHamburger\netc...');
            expect(createRecipeApi).toHaveBeenCalledTimes(1);
        })

    })
})