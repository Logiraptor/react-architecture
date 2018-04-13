import {Container, inject, injectable} from 'inversify'
import * as React from 'react'
import {ColorId} from './colorId/color'

const setStateSymbol = Symbol.for("setState")
const stateSymbol = Symbol.for("state")

interface ControllerClass<Props, State> {
    initialState: State
    new(): BaseController<Props, State>
}

// Higher order component which makes inversify compatible with react.
export function bound<Props, State, T extends BaseController<Props, State>>(BoundComponent: React.ComponentClass<Props>, serviceIdentifier: ControllerClass<Props, State>) {
    return class extends React.Component<{ container: Container }, State> {
        constructor(props: { container: Container }) {
            super(props)

            this.state = serviceIdentifier.initialState
        }

        render() {
            // locally bind state / setState so they can be property-injected in BaseController
            const localContainer = new Container()
            localContainer.parent = this.props.container
            localContainer.bind(setStateSymbol).toConstantValue(this.setState.bind(this))
            localContainer.bind(stateSymbol).toDynamicValue(() => this.state)

            // auto wire a controller for the current render pass
            let controller = localContainer.get(serviceIdentifier)
            return React.createElement(BoundComponent, controller.props())
        }
    }
}

export interface ColorIDState {
    color: string
    colorName: string
    loading: boolean
}

export interface ColorIDControllerProps {
    color: string
    colorName: string
    loading: boolean
    setColor(value: string): void
}

// The base controller which establishes some conventions to
// *hopefully* make this architecture familiar to react developers.
// with state / setState, you write code with all the same caveats as
// when in react. (dont mutate state, setState is asynchronous, etc)
@injectable()
abstract class BaseController<Props, State> {
    @inject(setStateSymbol)
    protected setState: (state: Partial<State>, callback?: () => void) => void
    @inject(stateSymbol)
    protected state: Readonly<State>

    abstract props(): Props
}

// notice that this class is just a plain javascript class.
// it can be constructed and inspected easily in tests.
@injectable()
export class ColorIDController extends BaseController<ColorIDControllerProps, ColorIDState> {
    // the initial state for the component is owned by its controller
    // this keeps the data all in one place
    static initialState: ColorIDState = {
        color: 'ff0000',
        loading: false,
        colorName: 'Red',
    }

    // adding this level of indirection for props() allows us to do any
    // normal OOP code in the enclosing class, while retaining control of what
    // gets exposed to the component
    props() {
        const {color, loading, colorName} = this.state
        return {
            setColor: (value: string) => this.fetchColorName(value),
            color, loading, colorName,
        }
    }

    private async fetchColorName(value: string) {
        await this.setState({loading: true, color: value})
        const response = await fetch('http://www.thecolorapi.com/id?hex=' + value)
        const colorId: ColorId = await response.json()
        console.log(colorId.name.value)
        await this.setState({loading: false, colorName: colorId.name.value})
    }
}
