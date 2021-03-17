import React from 'react';
import {fireEvent } from '@testing-library/react';
import EleWrapper from '../test-lib/ele-wrapper';
import Signup from '../signup';
import axiosInstance from '../../axiosApi';

jest.mock('../../axiosApi');

describe('<Signup/>', () => {
    it('It should call sign up api', () => {

        const comp = new EleWrapper(<Signup/>);
        comp.formFill({
            'username': 'NewUser',
            'password': 'APassword3',
            'email': 'NewUser@something.edu'
        }, 'name')
        expect(axiosInstance.createUserCount == 1);
    })

})
