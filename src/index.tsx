import * as React from 'react'
import * as ReactDOM from 'react-dom'
import 'reflect-metadata'
import {Container} from 'inversify'
import {ColorIDController} from './ColorIDController'
import {ColorIdentifier} from './ColorIdentifier'
import {BoundColorIDView} from './ColorIDView'
import {Symbols} from './Symbols'

const domNode = document.createElement('div');
document.documentElement.appendChild(domNode);

const container = new Container()
container.bind(ColorIDController).toSelf()
container.bind(Symbols.COLOR_IDENTIFIER).to(ColorIdentifier)

ReactDOM.render(<BoundColorIDView container={container}/>, domNode);
