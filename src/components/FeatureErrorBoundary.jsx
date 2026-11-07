import { Component } from 'react'
import { ErrorMessage } from './ErrorMessage'

export class FeatureErrorBoundary extends Component {
    state = { error: null }

    static getDerivedStateFromError(error) {
        return { error }
    }

    componentDidCatch(error, info) {
        console.error(`Unable to display ${this.props.feature}:`, error, info)
    }

    render() {
        return this.state.error
            ? <ErrorMessage error={this.state.error.message} />
            : this.props.children
    }
}
