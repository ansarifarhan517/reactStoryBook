import React from 'react';
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('app');

const App = () => <div>Hello</div>;

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
