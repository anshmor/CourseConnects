import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'

function Input() {
    const [id, setid] = useState("");
    const [course, setCourse] = useState("");
    const [prof, setProf] = useState("");
    const [share_url, setShare_url] = useState("")

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
            <Row>
                <Col>
                    <p>{course}</p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <p>{prof}</p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <p>{share_url}</p>
                </Col>
            </Row>
        </Container>
    )
}

export default Input;
