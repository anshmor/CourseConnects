import React from "react";
import {Card} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


function Header() {
    return (
        <Card>
            <Card.Img style={{ height:120, border: "none" }} src="grey.jpg"></Card.Img>
            <Card.ImgOverlay>
                <Card.Title style={{fontSize: "50px"}} className="text-center">CourseConnects</Card.Title>
                <Card.Text className="text-center" style={{fontSize: "20px", fontFamily: "Verdana"}}>
                Find the GroupMe for each of your UT courses!
                </Card.Text>
            </Card.ImgOverlay>
        </Card>
      );
}

export default Header;
