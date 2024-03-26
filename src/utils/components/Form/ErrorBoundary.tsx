import React from 'react'
import styled from 'styled-components';
import { Loader } from 'ui-library'

export default class ErrorBoundary extends React.Component<{}, { hasError: boolean}>  {
    constructor(props:any) {
      super(props);
      this.state = { hasError: false};
      
    }
  
    static getDerivedStateFromError() {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error:any, errorInfo:any) {
      // You can also log the error to an error reporting service
      console.log(error, errorInfo);
    }
    
     
    render() {
      const ErrorBoundaryWrapper=styled.div`
      background-color: #fafafa;
      display: flex;
      width:-webkit-fill-available;
      height:-webkit-fill-available;
      justify-content: center;
      align-items: center;
      `

      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <ErrorBoundaryWrapper ><Loader center /></ErrorBoundaryWrapper>;
      }
  
      return this.props.children; 
    }
  }