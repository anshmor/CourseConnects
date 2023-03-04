import React from "react";
import {Card, Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function CourseProfCard(props) {
    function handleClick() {
        props.onClick(props.courseProf);
    }

    return (
        <Card className="mb-3 my-card">
            <Card.Text className="text-center mt-2" style={{fontSize: "20px", fontFamily: "Verdana"}}>
                Course: {props.courseProf.course}
            </Card.Text>
            <Card.Text className="text-center" style={{fontSize: "20px", fontFamily: "Verdana"}}>
                Professor: {props.courseProf.prof}
            </Card.Text>
            <Button onClick={handleClick} className="my-button">Select</Button>
        </Card>
      );
}

export default CourseProfCard;
