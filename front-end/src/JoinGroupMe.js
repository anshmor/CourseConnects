import React from "react";
import {Card, Row, Col} from 'react-bootstrap';
import LinkButton from './LinkButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import {QRCodeSVG} from 'qrcode.react';
import './App.css';


function JoinGroupMe(props) {
    return (
        <div className="d-flex justify-content-center">
            <Card className="p-3 my-card">
                <Row>
                    <Col>
                        <Card.Text className="warning mb-1">*Website being introduced mid-semester so some classes may have a different prexisting GroupMe</Card.Text>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h3 className="card-text mb-1">Course: <strong>{props.courseProf.dept + " " + props.courseProf.courseNumber + " " + props.courseProf.course}</strong></h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h3 className="card-text mb-2">Professor: <strong>{props.courseProf.prof}</strong></h3>
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
                        bgColor={'#fbe6cc'}
                        fgColor={'#000000'}
                        />
                    </Col>
                </Row>
            </Card>
        </div>
      );
}

export default JoinGroupMe;
