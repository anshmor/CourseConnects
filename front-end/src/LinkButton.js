import Button from 'react-bootstrap/Button';
import './LinkButton.css';

function LinkButton(props) {
  return (
    <a href = {props.link} target="_blank" rel="noopener noreferrer">
      <Button variant="primary">GroupMe Link</Button>
    </a>
  );
}

export default LinkButton;