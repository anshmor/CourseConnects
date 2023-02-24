import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Card, InputGroup, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import QRCode from 'qrcode';

function Input() {
    const [id, setid] = useState("");
    const [course, setCourse] = useState("");
    const [prof, setProf] = useState("");
    const [share_url, setShare_url] = useState("")
    const [imageUrl, setImageUrl] = useState("")

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:5000/getGroup', {'id': id})
        .then((response) => {
            setShare_url(response.data.groupMe.share_url)
            setCourse(response.data.course)
            setProf(response.data.prof)
        })
        .catch((error) => {
            console.error(error)
        });
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
        })
        }
    }, [share_url])

    const handleInputChange = (event) => {
        // const { name, value } = event.target;
        // setid((prevFormData) => ({ ...prevFormData, [name]: value }));
        setid(event.target.value)
    };

    function validateInput() {
        return id.length === 5 || id.length === 0
    }

    return (
        <Container className="pt-3">
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formId">
                    <Form.Label>Class ID</Form.Label>
                    <Form.Control type="text" name="id" placeholder="Unique 5 digit ID"
                    onChange={handleInputChange} className={validateInput() ? 'is_valid' : 'is-invalid'} size='lg'/>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
            <Row className="pt-3">
                <Col>
                    {course ? <p>Course Title: {course}</p> : null}
                </Col>
            </Row>
            <Row>
                <Col>
                    {prof ? <p>Professor: {prof}</p> : null}
                </Col>
            </Row>
            <Row>
                <Col>
                    {share_url ? <p>GroupMe Link: {share_url}</p> : null}
                </Col>
            </Row>
            <Row>
                <Col>
                    {imageUrl ? <img src={imageUrl}/> : null}
                </Col>
            </Row>
        </Container>
    )
}

export default Input;
