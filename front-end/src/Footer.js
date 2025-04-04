import React from "react";
import {Card} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


function Footer() {
    return (
        <Card border="light" className="border-0 mt-3 mb-3">
            <Card.Text className="text-center footer">
            <span className="footer"><strong>Feedback?</strong> Email <a style={{color: 'black'}} href="mailto:help@courseconnects.com">help@courseconnects.com</a></span>
            </Card.Text>
        </Card>
      );
}

export default Footer;
