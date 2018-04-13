import * as React from 'react'
import {bound, ColorIDController} from './ColorIDController'

interface Props {
    controller: ColorIDController
}

export class ColorIDView extends React.Component<Props> {
    handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.controller.color = event.target.value
    }

    render() {
        return (
            <main>
                <h1>Color ID</h1>
                #<input key="colorInput" type="text" value={this.props.controller.color} onChange={this.handleColorChange}/>

                <div style={{width: '50px', height: '50px', backgroundColor: `#${this.props.controller.color}`}}/>

                {this.props.controller.loading ? 'Loading...' : this.props.controller.colorName}
            </main>
        )
    }
}

export const BoundColorIDView = bound(ColorIDView, ColorIDController)