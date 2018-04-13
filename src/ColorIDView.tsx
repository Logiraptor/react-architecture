import * as React from 'react'
import {bound} from '../Framework'
import {ColorIDController, ColorIDControllerProps} from './ColorIDController'

// Notice the props here. They correspond exactly to our controller's props() method
// this gives us a layer of indirection so we don't need to have a controller interface / fake / etc.
// This component is a simple 'Presentational' component and easily testable.
export class ColorIDView extends React.Component<ColorIDControllerProps> {
    handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.setColor(event.target.value)
    }

    render() {
        return (
            <main>
                <h1>Color ID</h1>
                #<input key="colorInput" type="text" value={this.props.color} onChange={this.handleColorChange}/>

                <div style={{width: '50px', height: '50px', backgroundColor: `#${this.props.color}`}}/>

                {this.props.loading ? 'Loading...' : this.props.colorName}
            </main>
        )
    }
}

export const BoundColorIDView = bound(ColorIDView, ColorIDController)
