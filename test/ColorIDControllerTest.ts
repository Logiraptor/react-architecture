import {Container} from 'inversify'
import {ColorIDController} from '../src/ColorIDController'
import sinon = require('sinon');
import {expect} from 'chai'
import {Symbols} from '../src/Symbols'

// Here we make a test container which will track the internal state
// in place of the bound(...) HOC.
function MakeTestContainer<T>(initialState: Readonly<T>) {
    let state = Object.assign(Object.create(initialState), initialState)
    const container = new Container()
    container.bind(Symbols.STATE).toDynamicValue(() => state)
    container.bind(Symbols.SET_STATE).toConstantValue((newState: Partial<T>) => {
        state = Object.assign(Object.create(state), state, newState)
    })
    container.bind(ColorIDController).toSelf()
    return container
}

describe('ColorIDController', () => {
    it('fetches a color name when the color changes', async () => {
        const testContainer = MakeTestContainer(ColorIDController.initialState)
        let colorIdentifierSpy = {
            identifyColor: sinon.spy()
        }
        testContainer.bind(Symbols.COLOR_IDENTIFIER).toConstantValue(colorIdentifierSpy)
        const subject = testContainer.get(ColorIDController)
        await subject.props().setColor('ff0000')
        expect(colorIdentifierSpy.identifyColor).to.have.been.calledWith('ff0000')
    })

    it('tracks the loading state of the color name request', async () => {
        const testContainer = MakeTestContainer(ColorIDController.initialState)
        const colorNamePromise = new Promise(resolve => setTimeout(() => resolve('Color Name'), 0))
        let colorIdentifierSpy = {
            identifyColor: sinon.spy(() => colorNamePromise)
        }
        let setStateSpy = sinon.spy()
        testContainer.rebind(Symbols.SET_STATE).toConstantValue(setStateSpy)
        testContainer.bind(Symbols.COLOR_IDENTIFIER).toConstantValue(colorIdentifierSpy)
        const subject = testContainer.get(ColorIDController)
        await subject.props().setColor('ff0000')
        expect(setStateSpy).to.have.been.calledWith({loading: true, color: 'ff0000'})
        expect(setStateSpy).to.have.been.calledWith({loading: false, colorName: 'Color Name'})
    })
})
