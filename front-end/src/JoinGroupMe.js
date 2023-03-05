import React from "react";
import {Container, Row, Col} from 'react-bootstrap';
import LinkButton from './LinkButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import {QRCodeSVG} from 'qrcode.react';
import './App.css';


function JoinGroupMe(props) {
    return (
        <Container>
            <Row className="pt-3">
                <Col>
                    <h3>Course: {props.courseProf.dept + " " + props.courseProf.courseNumber + " " + props.courseProf.course}</h3>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h3>Professor: {props.courseProf.prof}</h3>
                </Col>
            </Row>
            <Row>
                <Col>
                    <LinkButton link={props.courseProf.groupMe.share_url}>GroupMe Link</LinkButton>
                </Col>
            </Row>
            <Row>
                <Col>
                    <QRCodeSVG className="mt-3"
                    value={props.courseProf.groupMe.share_url}
                    size={256}
                    level={'H'}
                    bgColor={'#ffc784'}
                    fgColor={'#000000'}
                    />
                </Col>
            </Row>
        </Container>
      );
}

export default JoinGroupMe;
