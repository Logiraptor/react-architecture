import * as React from 'react'
import * as ReactDOM from 'react-dom'
import 'reflect-metadata'
import {Container} from 'inversify'
import {ColorIDController} from './ColorIDController'
import {BoundColorIDView} from './ColorIDView'

const domNode = document.createElement('div');
document.documentElement.appendChild(domNode);

const container = new Container()

container.bind(ColorIDController).to(ColorIDController)

ReactDOM.render(<BoundColorIDView container={container}/>, domNode);

