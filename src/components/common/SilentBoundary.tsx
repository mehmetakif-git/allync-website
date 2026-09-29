import React from 'react';

/**
 * Renders nothing when a decorative child throws — e.g. a three.js scene on a
 * device without WebGL — so a failed effect can never unmount the page around it
 * (a React render error with no boundary above it blanks the whole app).
 */
export class SilentBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
