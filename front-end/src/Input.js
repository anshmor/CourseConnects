import React, { useState, useEffect } from "react";
import { Form, InputGroup } from 'react-bootstrap';

function Input() {
    return (
        <Form.Group controlId="id">
        <Form.Label>Class Unique ID:</Form.Label>
        <InputGroup>
            <Form.Control type="text" placeholder="5 digit unique ID" />
        </InputGroup>
        </Form.Group>
    )
}

export default Input;
