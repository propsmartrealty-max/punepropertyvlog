import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-red-50 p-10 z-[9999] relative">
                    <div className="max-w-4xl w-full bg-white shadow-xl rounded-lg p-8 border border-red-100">
                        <h1 className="text-3xl font-bold text-red-600 mb-4">Something went wrong.</h1>
                        <div className="bg-slate-100 p-4 rounded overflow-auto mb-4">
                            <p className="font-mono text-red-500 font-bold">{this.state.error?.toString()}</p>
                        </div>
                        <div className="bg-slate-800 text-slate-200 p-4 rounded overflow-auto h-64 text-xs font-mono">
                            {this.state.errorInfo?.componentStack}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
