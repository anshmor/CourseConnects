import React from "react";
import {Card} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


function Header() {
    return (
        <Card border="light" className="border-0 mt-3 mb-3">
            <Card.Text className="text-center" style={{fontSize: "20px", fontFamily: "Verdana"}}>
            <span><strong>Feedback?</strong> Email <a style={{color: 'black'}} href="mailto:help@courseconnects.com">help@courseconnects.com</a></span>
            </Card.Text>
        </Card>
      );
}

export default Header;
