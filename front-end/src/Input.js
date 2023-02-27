import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import QRCode from 'qrcode';
import LinkButton from'./LinkButton';

function Input() {
    const [id, setid] = useState("");
    const [course, setCourse] = useState("");
    const [prof, setProf] = useState("");
    const [share_url, setShare_url] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const inputRef = useRef(null);
    const backend_uri = 'https://courseconnects.herokuapp.com'

    const handleSubmit = (event) => {
        event.preventDefault();
        //inputRef.current.select();
        if (id.length !== 5) {
            setShare_url('');
            setCourse('');
            setProf('');
            setImageUrl('');
            setErrorMessage('Code should be 5 digits long');
        }
        else {
            axios.post(backend_uri + '/getGroup', {'id': id})
                .then((response) => {
                    if (response.data.course === "") {
                        setShare_url('');
                        setCourse('');
                        setProf('');
                        setImageUrl('');
                        setErrorMessage('Course not found')
                    }
                    else if (response.data.groupMe.share_url.startsWith("Error")){
                        setCourse(response.data.dept + " " + response.data.courseNumber + " " + response.data.course);
                        setProf(response.data.prof);
                        setErrorMessage(response.data.groupMe.share_url);
                        setShare_url('');
                        setImageUrl('');
                    }
                    else {
                        setErrorMessage('');
                        setShare_url(response.data.groupMe.share_url);
                        setCourse(response.data.dept + " " + response.data.courseNumber + " " + response.data.course);
                        setProf(response.data.prof);
                    }
                })
                .catch((error) => {
                    setShare_url('');
                    setCourse('');
                    setProf('');
                    setImageUrl('');
                    setErrorMessage('Error getting class information')
                    console.error(error)
                });
        }
    };

    useEffect(() => {
        // generate qr code
        if (share_url) {
            QRCode.toDataURL(share_url)
            .then((response) => {
                setImageUrl(response)
            })
            .catch((error) => {
                console.error(error)
                setImageUrl('');
            })
        }
    }, [share_url])

    const handleInputChange = (event) => {
        setid(event.target.value);
    };

    function validateInput() {
        return id.length === 5 || id.length === 0;
    }

    function handleFocus() {
        inputRef.current.select()
    }

    return (
        <Container className="pt-3">
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formId">
                    <Form.Label>Course ID</Form.Label>
                    <Form.Control type="text" name="id" placeholder="Unique 5 digit ID" ref={inputRef} onFocus={handleFocus}
                    onChange={handleInputChange} className={validateInput() ? 'is_valid' : 'is-invalid'} size='lg'/>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
            <Container className="text-center">
                <Row className="pt-3">
                    <Col>
                        {errorMessage ? <h3>{errorMessage}</h3> : null}
                    </Col>
                </Row>
                <Row className="pt-3">
                    <Col>
                        {course ? <h3>Course: {course}</h3> : null}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {prof ? <h3>Professor: {prof}</h3> : null}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {share_url ? <LinkButton link={share_url}>GroupMe Link</LinkButton> : null}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {imageUrl ? <img src={imageUrl} alt="QR Code should be here :(" style={{width:"250px",height:"250px"}}/> : null}
                    </Col>
                </Row>
            </Container>
        </Container>
    )
}

export default Input;
