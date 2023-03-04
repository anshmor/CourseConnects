import React from "react";
import {Container, Row, Col} from 'react-bootstrap';
import LinkButton from './LinkButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


function JoinGroupMe(props) {
    return (
        <Container>
            <Row className="pt-3">
                <Col>
                    {props.courseProf ? <h3>Course: {props.courseProf.dept + " " + props.courseProf.courseNumber + " " + props.courseProf.course}</h3> : null}
                </Col>
            </Row>
            <Row>
                <Col>
                    {props.courseProf ? <h3>Professor: {props.courseProf.prof}</h3> : null}
                </Col>
            </Row>
            <Row>
                <Col>
                    {props.courseProf ? <LinkButton link={props.courseProf.groupMe.share_url}>GroupMe Link</LinkButton> : null}
                </Col>
            </Row>
            <Row>
                <Col>
                    {props.imageUrl ? <img src={props.imageUrl} alt="QR Code should be here :(" style={{width:"250px",height:"250px"}}/> : null}
                </Col>
            </Row>
        </Container>
      );
}

export default JoinGroupMe;
