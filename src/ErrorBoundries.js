import * as React from "react";

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false, error: null, errorInfo: null};
    }

    setError(error, info) {
        // Update state so the next render will show the fallback UI.
        this.setState({hasError: true, error: error, errorInfo: info});
        this.props.reportError(error, info);
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        this.setError(error, errorInfo);
        this.props.reportError(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1>Something went wrong. This is the fall back UI</h1>;
        }
        return React.Children.map(this.props.children,
            child => React.cloneElement(child, {
                propagateError: (e, i)=>this.setError(e, i)
            }));
    }
}