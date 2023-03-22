import React, { useState,  useEffect } from "react";
import Input from './Input'
import Header from './Header'
import Footer from './Footer'
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

function App() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsSmallScreen(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsSmallScreen(event.matches);
    };

    mediaQuery.addListener(handleMediaQueryChange);

    return () => {
      mediaQuery.removeListener(handleMediaQueryChange);
    };
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Container>
        <Header isSmallScreen={isSmallScreen}/>
        <Input isSmallScreen={isSmallScreen}/>
      </Container>

      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
}

export default App;
