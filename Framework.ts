import {Container, interfaces} from 'inversify'
import * as React from 'react'
import {Observable} from 'rxjs/Observable'
import {AnonymousSubscription} from 'rxjs/Subscription'
import Newable = interfaces.Newable

interface BoundState<State, Controller> {
    subscription?: AnonymousSubscription
    wrappedComponentProps?: State
    controller: Controller
}

// Higher order component which makes inversify / rxjs compatible with react.
export function bound<Props, Controller> (
    BoundComponent: React.ComponentClass<Props>,
    serviceIdentifier: Newable<Controller>,
    mapStateToObservable: (state: Controller) => Observable<Props>,
) {
    return class bound extends React.Component<{ container: Container }, BoundState<Props, Controller>> {
        state: BoundState<Props, Controller> = {
            controller: this.props.container.get(serviceIdentifier),
        }

        componentDidMount() {
            this.setState({
                subscription: mapStateToObservable(this.state.controller).subscribe({
                    next: (value) => {
                        this.onObservedStateChange(value)
                    }
                })
            })
        }

        componentWillUnmount() {
            if (!this.state.subscription) return
            this.state.subscription.unsubscribe()
        }

        onObservedStateChange(value?: Props): void {
            this.setState({
                wrappedComponentProps: value
            })
        }

        render() {
            if (!this.state.wrappedComponentProps) {
                return null
            }
            return React.createElement(BoundComponent, this.state.wrappedComponentProps)
        }
    }
}
