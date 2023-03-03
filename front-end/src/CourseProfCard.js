import React from "react";
import {Card, Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


function CourseProfCard(props) {
    function handleClick() {
        props.onClick(props.courseProf.course, props.courseProf.prof, props.courseProf.dept, props.courseProf.courseNumber,
            props.courseProf.groupMe.share_url);
    }

    return (
        <Card border="primary" className="mb-3">
            <Card.Text className="text-center" style={{fontSize: "20px", fontFamily: "Verdana"}}>
                Course: {props.courseProf.course}
            </Card.Text>
            <Card.Text className="text-center" style={{fontSize: "20px", fontFamily: "Verdana"}}>
                Professor: {props.courseProf.prof}
            </Card.Text>
            <Button onClick={handleClick}>Select</Button>
        </Card>
      );
}

export default CourseProfCard;
