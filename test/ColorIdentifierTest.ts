import * as fetchMock from 'fetch-mock'
import {ColorIdentifier} from '../src/ColorIdentifier'
import {expect} from 'chai'

describe('ColorIdentifier', () => {
    describe('#identifyColor', () => {
        it('makes a GET to the color api', async () => {
            const hex = 'hexValue'
            fetchMock.get('http://www.thecolorapi.com/id?hex=' + hex, {
                name: {
                    value: 'Color Name',
                },
            })

            const subject = new ColorIdentifier()
            const colorName = await subject.identifyColor(hex)
            expect(colorName).to.eql('Color Name')

            fetchMock.restore()
        })
    })
})
