import {Container, inject, injectable} from 'inversify'
import * as React from 'react'
import {ColorId} from './colorId/color'

const setStateSymbol = "<setState>"
const stateSymbol = "<state>"

interface ControllerClass<T> {
    initialState: T
    new(): BaseController<T>
}

export function bound<State, T extends BaseController<State>>(BoundComponent: React.ComponentClass<{controller: T}>, serviceIdentifier: ControllerClass<State>) {
    return class extends React.Component<{container: Container}, {controllerState: State}> {
        constructor(props: {container: Container}) {
            super(props)

            this.state = {
                controllerState: serviceIdentifier.initialState,
            }
        }

        render() {
            const localContainer = new Container()
            localContainer.parent = this.props.container
            localContainer.bind<(state: State) => void>(setStateSymbol).toConstantValue(s => {
                return new Promise(resolve => {
                    this.setState({controllerState: s}, resolve)
                })
            })
            localContainer.bind<State>(stateSymbol).toDynamicValue(() => this.state.controllerState)

            return React.createElement(BoundComponent, {controller: localContainer.get(serviceIdentifier)})
        }
    }
}

export interface ColorIDState {
    color: string
    colorName: string
    loading: boolean
}

@injectable()
class BaseController<T> {
    @inject(setStateSymbol)
    protected setState: (state: Partial<T>) => Promise<void>
    @inject(stateSymbol)
    protected state: Readonly<T>
}

@injectable()
export class ColorIDController extends BaseController<ColorIDState> {
    static initialState: ColorIDState = {
        color: 'ff0000',
        loading: false,
        colorName: 'Red'
    }

    set color(value: string) {
        console.log(value)
        this.fetchColorName(value)
    }

    get color() {
        return this.state.color
    }

    get loading() {
        return this.state.loading
    }

    get colorName() {
        return this.state.colorName
    }

    private async fetchColorName(value: string) {
        await this.setState({loading: true, color: value})
        const response = await fetch('http://www.thecolorapi.com/id?hex=' + value)
        const colorId: ColorId = await response.json()
        console.log(colorId.name.value)
        await this.setState({loading: false, colorName: colorId.name.value})
    }
}
