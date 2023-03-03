import React from "react";
import {Card, Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


function CourseProfCard(props) {
    function handleClick() {
        props.onClick(props.id);
    }

    return (
        <Card border="primary" className="mb-3">
            <Card.Text className="text-center" style={{fontSize: "20px", fontFamily: "Verdana"}}>
                Course: {props.course}
            </Card.Text>
            <Card.Text className="text-center" style={{fontSize: "20px", fontFamily: "Verdana"}}>
                Professor: {props.prof}
            </Card.Text>
            <Button onClick={handleClick}>Select</Button>
        </Card>
      );
}

export default CourseProfCard;
