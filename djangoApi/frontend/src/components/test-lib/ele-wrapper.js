import {screen, render, fireEvent, queryByAttribute, queryByRole} from '@testing-library/react';

// Helper class to make testing component rendering and queries easier
export default class EleWrapper {
    constructor(ele) {
        this.ele = ele;
        this.rendered = render(ele);
        this.getChild = this.getChild.bind(this);
        this.formFill = this.formFill.bind(this);
    }

    getChild(id, attribute='id') {
        return queryByAttribute(attribute, this.rendered.container, id);
    }


    formFill(dict, attribute='id', submit=true) {
        Object.keys(dict).forEach((key) => {
            fireEvent.change(this.getChild(key, attribute), {target: {value: dict[key]}});
        })
        if(submit) {
            return fireEvent.click(this.getChild('submit', 'type'));
        }
    }
}