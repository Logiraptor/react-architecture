import {inject, injectable} from 'inversify'
import {BaseController} from '../Framework'
import {ColorIdentifier} from './ColorIdentifier'
import {Symbols} from './Symbols'

export interface ColorIDState {
    color: string
    colorName: string
    loading: boolean
}

// notice that this class is just a plain javascript class.
// it can be constructed and inspected easily in tests.
@injectable()
export class ColorIDController extends BaseController<ColorIDState> {
    // the initial state for the component is owned by its controller
    // this keeps the data all in one place
    static initialState: ColorIDState = {
        color: 'ff0000',
        loading: false,
        colorName: 'Red',
    }

    constructor(@inject(Symbols.COLOR_IDENTIFIER)
                private colorIdentifier: ColorIdentifier) {
        super()
    }

    get color() {
        return this.state.color
    }

    get colorName() {
        return this.state.colorName
    }

    get loading() {
        return this.state.loading
    }

    setColor = (value: string) => this.fetchColorName(value)

    private async fetchColorName(value: string) {
        await this.setState({loading: true, color: value})
        const colorName = await this.colorIdentifier.identifyColor(value)
        await this.setState({loading: false, colorName: colorName})
    }
}
