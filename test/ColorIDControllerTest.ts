import {expect} from 'chai'
import {ColorIDController} from '../src/ColorIDController'
import sinon = require('sinon')

describe('ColorIDController', () => {
    it('fetches a color name when the color changes', async () => {
        let colorIdentifierSpy = {
            identifyColor: sinon.spy()
        }
        const subject = new ColorIDController(colorIdentifierSpy)
        subject.setColor('ff0000')
        expect(colorIdentifierSpy.identifyColor).to.have.been.calledWith('ff0000')
    })

    it('tracks the loading state of the color name request', async () => {
        const colorNameSpy = sinon.spy()
        const loadingSpy = sinon.spy()
        const colorNamePromise = Promise.resolve('Color Name')
        let colorIdentifierSpy = {
            identifyColor: sinon.spy(() => colorNamePromise)
        }
        const subject = new ColorIDController(colorIdentifierSpy)
        subject.colorName.subscribe(colorNameSpy)
        subject.loading.subscribe(loadingSpy)
        await subject.setColor('ff0000')
        expect(loadingSpy).to.have.been.calledWith(true)
        expect(loadingSpy).to.have.been.calledWith(false)
        expect(colorNameSpy).to.have.been.calledWith('Color Name')
    })
})
