import React from "react";
import {Card, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


function Header() {
    return (
        <Card>
            <Card.Img style={{ height:100, border: "none" }} src="grey.jpg"></Card.Img>
            <Card.ImgOverlay>
                <Card.Title style={{fontSize: "40px", fontFamily: "Verdana"}} className="text-center">CourseConnects</Card.Title>
                <Card.Text className="text-center" style={{fontFamily: "Verdana"}}>
                Find the groupMe for each of your UT courses!
                </Card.Text>
            </Card.ImgOverlay>
        </Card>
      );
}

export default Header;
