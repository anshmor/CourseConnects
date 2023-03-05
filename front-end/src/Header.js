import React from "react";
import {Card} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


function Header() {
    return (
        <Card className="header p-2">
            <Card.Title  className="text-center mt-2 title">CourseConnects</Card.Title>
            <Card.Text className="text-center mb-2 subtitle">
            Find the GroupMe for each of your UT courses!
            </Card.Text>
        </Card>
      );
}

export default Header;
