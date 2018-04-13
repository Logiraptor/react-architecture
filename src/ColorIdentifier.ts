import {injectable} from 'inversify'
import {ColorId} from './colorId/color'

@injectable()
export class ColorIdentifier {
    async identifyColor(hex: string): Promise<string> {
        const response = await fetch('http://www.thecolorapi.com/id?hex=' + hex)
        const colorId: ColorId = await response.json()
        return colorId.name.value
    }
}
