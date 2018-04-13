import {Container, inject, injectable} from 'inversify'
import * as React from 'react'
import {Symbols} from './src/Symbols'

// The base controller which establishes some conventions to
// *hopefully* make this architecture familiar to react developers.
// with state / setState, you write code with all the same caveats as
// when in react. (dont mutate state, setState is asynchronous, etc)
@injectable()
export abstract class BaseController<Props, State> {
    @inject(Symbols.SET_STATE)
    protected setState: (state: Partial<State>, callback?: () => void) => void
    @inject(Symbols.STATE)
    protected state: Readonly<State>

    abstract props(): Props
}

interface ControllerClass<Props, State> {
    initialState: State
    new(...args: any[]): BaseController<Props, State>
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
            localContainer.bind(Symbols.SET_STATE).toConstantValue(this.setState.bind(this))
            localContainer.bind(Symbols.STATE).toDynamicValue(() => this.state)

            // auto wire a controller for the current render pass
            let controller = localContainer.get(serviceIdentifier)
            return React.createElement(BoundComponent, controller.props())
        }
    }
}
