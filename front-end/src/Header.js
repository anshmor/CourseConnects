import React from "react";
import {Card} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


function Header() {
    return (
        <Card className="header">
            <Card.Title style={{fontSize: "50px"}} className="text-center mt-2">CourseConnects</Card.Title>
            <Card.Text className="text-center mb-2" style={{fontSize: "20px", fontFamily: "Verdana"}}>
            Find the GroupMe for each of your UT courses!
            </Card.Text>
        </Card>
      );
}

export default Header;
