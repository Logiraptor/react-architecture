import * as React from 'react'
import {Observable} from 'rxjs/Observable'
import {bound} from '../Framework'
import {ColorIDController} from './ColorIDController'

export interface Props {
    color: string
    colorName: string
    loading: boolean
    setColor(value: string): void
}

// This component is a simple 'Presentational' component and easily testable.
export class ColorIDView extends React.Component<Props> {
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

// Here we bind the controller to the react component.
// This is essentially the react-redux `connect` HOC.
// The function here maps controller properties to react props using rxjs.
export const BoundColorIDView = bound(ColorIDView, ColorIDController, controller => {
    return Observable.combineLatest(controller.color, controller.colorName, controller.loading,
        (color, colorName, loading) => {
            return {
                color, colorName, loading, setColor: controller.setColor
            }
        })
})
