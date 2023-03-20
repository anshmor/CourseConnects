import React from "react";
import {Card, Image} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


function Header() {
    return (
        <Card className="header header-card" style={{ alignItems: 'center' }}>
            <div className="d-flex justify-content-center">
                <Card.Title  className="text-center title mx-3"><Image className="logo" src="CCLogo.png" alt="CC" fluid />CourseConnects</Card.Title>
            </div>
            <Card.Text className="text-center mb-1 subtitle">
                Join the GroupMe for each of your UT classes!
            </Card.Text>
        </Card>
      );
}

export default Header;
