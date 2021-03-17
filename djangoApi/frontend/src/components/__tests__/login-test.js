import React from 'react';
import {fireEvent } from '@testing-library/react';
import EleWrapper from '../test-lib/ele-wrapper';
import Login from '../login';
import axios from '../../axiosApi';

jest.mock('../../axiosApi');

describe('<Login/>', () => {
    it('It should call login api', () => {

        const comp = new EleWrapper(<Login/>);
        comp.formFill({
            'username': 'username',
            'password': 'password'
        }, 'name');
        expect(axios.loginCount == 1);
    })
})