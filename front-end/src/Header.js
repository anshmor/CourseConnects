import React from "react";
import {Card} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


function Header() {
    return (
        <Card className="header p-2 header-card">
            <Card.Title  className="text-center title">CourseConnects</Card.Title>
            <Card.Text className="text-center mb-1 subtitle">
            Find the GroupMe for each of your UT courses!
            </Card.Text>
        </Card>
      );
}

export default Header;
