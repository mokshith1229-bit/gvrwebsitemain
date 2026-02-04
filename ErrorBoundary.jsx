import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '40px', color: '#7f1d1d', backgroundColor: '#fef2f2', fontFamily: 'sans-serif' }}>
                    <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Something went wrong.</h1>
                    <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #fee2e2', overflow: 'auto' }}>
                        <h3 style={{ marginTop: 0 }}>Error:</h3>
                        <pre style={{ color: '#ef4444' }}>{this.state.error && this.state.error.toString()}</pre>
                        <h3 style={{ marginTop: '20px' }}>Stack Trace:</h3>
                        <pre style={{ fontSize: '12px', color: '#666' }}>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
