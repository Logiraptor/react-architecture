import {inject, injectable} from 'inversify'
import {BehaviorSubject} from 'rxjs/Rx'
import {ColorIdentifier} from './ColorIdentifier'
import {Symbols} from './Symbols'

@injectable()
export class ColorIDController {
    constructor(@inject(Symbols.COLOR_IDENTIFIER) private colorIdentifier: ColorIdentifier) {
        this.color.subscribe(value => this.fetchColorName(value))
    }

    readonly color: BehaviorSubject<string> = new BehaviorSubject<string>('ff0000')
    readonly colorName: BehaviorSubject<string> = new BehaviorSubject<string>('Red')
    readonly loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

    setColor = (value: string) => {
        this.color.next(value)
    }

    private async fetchColorName(value: string) {
        this.loading.next(true)
        const colorName = await this.colorIdentifier.identifyColor(value)
        this.loading.next(false)
        this.colorName.next(colorName)
    }
}
