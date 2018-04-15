import {expect} from 'chai'
import {mount} from 'enzyme'
import * as React from 'react'
import {ColorIDView, Props} from '../src/ColorIDView'
import sinon = require('sinon')

describe('ColorIDView', () => {
    function render(props: Partial<Props>) {
        const defaultProps: Props = {
            color: 'ff0000',
            colorName: 'Red',
            loading: false,
            setColor() {
            },
        }
        return mount(<ColorIDView {...defaultProps} {...props}/>)
    }

    it('renders the current color name', () => {
        const subject = render({
            colorName: 'Red',
        })
        expect(subject).to.contain.text('Red')
    })

    it('binds an input to the color property', () => {
        const subject = render({
            color: 'ff0000',
        })
        expect(subject).to.containMatchingElement(<input value="ff0000"/>)
    })

    it('binds an input to setColor', () => {
        let setColorSpy = sinon.spy()
        const subject = render({
            setColor: setColorSpy,
        })
        subject.find('input').simulate('change', {
            target: {value: 'newColorValue'},
        })
        expect(setColorSpy).to.have.been.calledWith('newColorValue')
    })

    it('hides the color name while loading', () => {
        const subject = render({
            loading: true,
            colorName: 'Should not show',
        })
        expect(subject).to.contain.text('Loading...')
        expect(subject).not.to.contain.text('Should not show')
    })
})
