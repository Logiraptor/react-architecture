import {Container, interfaces} from 'inversify'
import * as React from 'react'
import {Observable} from 'rxjs/Observable'
import {AnonymousSubscription} from 'rxjs/Subscription'
import Newable = interfaces.Newable

interface BoundState<InjectedProps, Controller> {
    subscription?: AnonymousSubscription
    wrappedComponentProps?: InjectedProps
    controller: Controller
}

interface ExternalProps {
    container: Container
}

type MissingProps<A, B> = Pick<A, Exclude<keyof A, keyof B>>

// Higher order component which makes inversify / rxjs compatible with react.
export function bound<Controller, InjectedProps>(serviceIdentifier: Newable<Controller>, mapStateToObservable: (state: Controller) => Observable<InjectedProps>) {
    return function <OriginalProps extends {}>(BoundComponent: React.ComponentClass<OriginalProps>) {
        type ResultProps = ExternalProps & MissingProps<OriginalProps, InjectedProps>

        return class bound extends React.Component<ResultProps, BoundState<InjectedProps, Controller>> {
            state: BoundState<InjectedProps, Controller> = {
                controller: this.props.container.get(serviceIdentifier),
            }

            componentDidMount() {
                this.setState({
                    subscription: mapStateToObservable(this.state.controller).subscribe({
                        next: (value) => {
                            this.onObservedStateChange(value)
                        },
                    }),
                })
            }

            componentWillUnmount() {
                if (!this.state.subscription) return
                this.state.subscription.unsubscribe()
            }

            onObservedStateChange(value?: InjectedProps): void {
                this.setState({
                    wrappedComponentProps: value,
                })
            }

            render() {
                if (!this.state.wrappedComponentProps) {
                    return null
                }
                return React.createElement(BoundComponent, {...(this.props as any), ...this.props as any})
            }
        }
    }
}
