"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryState {
	hasError: boolean;
	error?: Error;
}

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("Error caught by boundary:", error, errorInfo);

		// Report to Umami — safe to call from a class component because
		// track.* functions are plain module-level functions, not hooks.
		import("@/lib/umami").then(({ track }) => {
			track.errorBoundaryTriggered(errorInfo.componentStack ?? undefined);
		});
	}

	resetError = () => {
		this.setState({ hasError: false, error: undefined });
	};

	render() {
		if (this.state.hasError) {
			const FallbackComponent = this.props.fallback;
			if (FallbackComponent && this.state.error) {
				return (
					<FallbackComponent
						error={this.state.error}
						resetError={this.resetError}
					/>
				);
			}

			// Default fallback UI
			return (
				<div className="flex flex-col items-center justify-center p-8 text-center">
					<h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
					<p className="text-muted-foreground mb-4">
						We&apos;re sorry, but something unexpected happened.
					</p>
					<button
						onClick={this.resetError}
						className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
					>
						Try again
					</button>
				</div>
			);
		}

		return this.props.children;
	}
}
