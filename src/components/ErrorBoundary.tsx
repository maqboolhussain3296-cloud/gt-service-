import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message || 'Unexpected application error' };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-3 shadow-sm">
            <h2 className="font-display font-bold text-lg text-slate-900">
              Kuch masla pesh aaya hai
            </h2>
            <p className="text-xs text-slate-600 break-words">{this.state.message}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="h-10 px-5 rounded-xl bg-[#007A4D] text-white text-xs font-semibold cursor-pointer"
            >
              Page Reload Karain
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
