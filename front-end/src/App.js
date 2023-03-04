import Input from './Input'
import Header from './Header'
import Footer from './Footer'
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

function App() {

  return (
    <div className="d-flex flex-column min-vh-100">
      <Container>
        <Header />
        <Input />
      </Container>
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
}

export default App;
