import Button from 'react-bootstrap/Button';
import './App.css';

function LinkButton(props) {
  return (
    <a href = {props.link} target="_blank" rel="noopener noreferrer">
      <Button className="my-button" variant="primary">GroupMe Link</Button>
    </a>
  );
}

export default LinkButton;