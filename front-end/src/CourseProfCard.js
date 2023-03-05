import React from "react";
import {Card, Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function CourseProfCard(props) {
    function handleClick() {
        props.onClick(props.courseProf);
    }

    return (
        <Card className="mb-3 my-card p-4">

                <Card.Text className="card-text">
                    Course: <strong>{props.courseProf.course}</strong>
                </Card.Text>
                <Card.Text className="card-text">
                    Professor: <strong>{props.courseProf.prof}</strong>
                </Card.Text>
                <Button onClick={handleClick} className="my-button">Select</Button>
            
        </Card>
      );
}

export default CourseProfCard;
