import React from "react";
import {Card} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


function Header() {
    return (
        <Card border="light" className="border-0">
            <Card.Text className="text-center" style={{fontSize: "20px", fontFamily: "Verdana"}}>
            <div><strong>Feedback?</strong> Email <a style={{color: 'black'}} href="mailto:help@courseconnects.com">help@courseconnects.com</a></div>
            </Card.Text>
        </Card>
      );
}

export default Header;
