import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import QRCode from 'qrcode';
import LinkButton from './LinkButton';
import CourseProfCard from './CourseProfCard';

function Input() {
    const [id, setid] = useState("");
    const [courseCode, setCourseCode] = useState("");
    const [course, setCourse] = useState("");
    const [prof, setProf] = useState("");
    const [share_url, setShare_url] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [coursesProfs, setCoursesProfs] = useState([]);

    const IDRef = useRef(null);
    const courseRef = useRef(null);

    const backend_uri = 'https://courseconnects.herokuapp.com'
    //const backend_uri = 'http://localhost:5000'
    const depts = new Set(['AI', 'AAR', 'AAS', 'ACC', 'ACF', 'ADV', 'AED', 'AET', 'AFR', 'AFS', 'AHC', 'ALD', 'AMS', 
    'ANS', 'ANT', 'ARA', 'ARC', 'ARE', 'ARH', 'ARI', 'ART', 'ARY', 'ASE', 'ASL', 'AST', 'BA', 'BCH', 'BDP', 'BEN', 
    'BGS', 'BIO', 'BME', 'BSN', 'CC', 'CE', 'CL', 'CS', 'CAM', 'CGS', 'CH', 'CHE', 'CHI', 'CLA', 'CLS', 'CMS', 'COE', 
    'COM', 'CON', 'CRP', 'CRW', 'CSD', 'CTI', 'CZ', 'CLD', 'CSE', 'DB', 'DAN', 'DCH', 'DES', 'DEV', 'DRS', 'DS', 'E', 
    'EE', 'EM', 'ES', 'ECE', 'ECO', 'EDA', 'EDC', 'EDP', 'EEE', 'EER', 'ENM', 'ENS', 'ESL', 'EUP', 'EUS', 'EVE', 'EVS', 
    'ELP', 'FA', 'FC', 'FH', 'FIN', 'FLE', 'FLU', 'FNH', 'FR', 'GE', 'GEO', 'GER', 'GK', 'GOV', 'GRC', 'GRG', 'GRS', 'GSD', 
    'GUI', 'HE', 'HS', 'HAR', 'HDF', 'HDO', 'HEB', 'HED', 'HIN', 'HIS', 'HMN', 'HSC', 'HCT', 'IB', 'IMS', 'INF', 'IRG', 'ISL', 
    'ITC', 'ITL', 'ILA', 'I', 'ISP', 'ITD', 'J', 'JS', 'JPN', 'KIN', 'KOR', 'LA', 'LAH', 'LAL', 'LAR', 'LAS', 'LAT', 'LAW', 
    'LEB', 'LIN', 'LTC', 'M', 'ME', 'MS', 'MAL', 'MAN', 'MAS', 'MBU', 'MDV', 'MED', 'MEL', 'MES', 'MFG', 'MIS', 'MKT', 'MLS', 
    'MNS', 'MOL', 'MRT', 'MSE', 'MST', 'MUS', 'N', 'NS', 'NE', 'NEU', 'NOR', 'NSC', 'NTR', 'OM', 'OBO', 'OPR', 'ORG', 'ORI', 
    'PA', 'PL', 'PR', 'PS', 'PBH', 'PED', 'PER', 'PGE', 'PHL', 'PHM', 'PHR', 'PHY', 'PIA', 'POL', 'POR', 'PRC', 'PRF', 'PRS', 
    'PSH', 'PSY', 'PGS', 'PSF', 'RE', 'RM', 'RS', 'REC', 'REE', 'RHE', 'ROM', 'RTF', 'RUS', 'RIM', 'SC', 'SS', 'SW', 'SAL', 
    'SAN', 'SAX', 'SCA', 'SCI', 'SDS', 'SED', 'SEL', 'SLA', 'SME', 'SOC', 'SPC', 'SPN', 'SSB', 'SSC', 'STA', 'STC', 'STS', 
    'SUS', 'SWA', 'SWE', 'STM', 'SLH', 'TC', 'TD', 'TAM', 'TBA', 'TEL', 'TRO', 'TRU', 'TUR', 'TXA', 'UD', 'UDN', 'UGS', 'URB', 
    'URD', 'UTL', 'UTS', 'UKR', 'VC', 'VAS', 'VIA', 'VIB', 'VIO', 'VOI', 'VTN', 'WCV', 'WGS', 'WRT', 'YID', 'YOR'])

    const handleError = (error) => {
        setShare_url('');
        setCourse('');
        setProf('');
        setImageUrl('');
        setErrorMessage('Error getting class information')
        console.error(error)
    };

    const handleCourseProfSelection = (course, prof, dept, courseCode, groupMeUrl) => {
        setShare_url(groupMeUrl);
        setCourse(dept + " " + " " + course);
        setProf(prof);
        setErrorMessage('');
        setCoursesProfs([]);
    }


    const handleIDSubmit = (event) => {
        event.preventDefault();
        //inputRef.current.select();
        setShare_url('');
        setCourse('');
        setProf('');
        setImageUrl('');
        setErrorMessage('');
        setCoursesProfs([]);
        if (!validateID() || id.length === 0) {
            setErrorMessage('Invalid Input');
         }
        else {
            axios.get(backend_uri + '/getGroup', {
                params: {
                id: id.trim()
                }
                })
                .then((response) => {
                    if (response.data.course === "") {
                        setErrorMessage('Course not found')
                    }
                    else if (response.data.groupMe.share_url.startsWith("Error")){
                        setCourse(response.data.dept + " " + response.data.courseNumber + " " + response.data.course);
                        setProf(response.data.prof);
                        setErrorMessage(response.data.groupMe.share_url);
                    }
                    else {
                        setShare_url(response.data.groupMe.share_url);
                        setCourse(response.data.dept + " " + response.data.courseNumber + " " + response.data.course);
                        setProf(response.data.prof);
                    }
                })
                .catch((error) => {
                    handleError(error);
                });
        }
    };

    const handleCourseSubmit = (event) => {
        event.preventDefault();
        setShare_url('');
        setCourse('');
        setProf('');
        setImageUrl('');
        setErrorMessage('');
        setCoursesProfs([]);
        if (!validateCourse() || courseCode.length === 0) {
            setErrorMessage('Invalid Input');
        }
        else {
            let temp = courseCode.trim().split(/\s+/);
            let dept = temp[0].toUpperCase();
            let courseNumber = temp[1].toUpperCase();
            axios.get(backend_uri + '/getGroupsCourseCode', {
                params: {
                  dept: dept,
                  courseCode: courseNumber
                }
                })
                .then(response => {
                    if (response.data === 'No Matches') {
                        setErrorMessage('No associated courses with what you entered');
                    }
                    else {
                        const tempCoursesProfs = [];
                        for (let i = 0; i < response.data.length; i++) {
                            tempCoursesProfs.push(response.data[i]);
                        }
                        setCoursesProfs(tempCoursesProfs);
                    }
                })
                .catch((error) => {
                    handleError(error);
                });
        }
    }

    useEffect(() => {
        // generate qr code
        if (share_url) {
            QRCode.toDataURL(share_url)
            .then((response) => {
                setImageUrl(response)
            })
            .catch((error) => {
                console.error(error)
                setImageUrl('');
            })
        }
    }, [share_url])

    const handleIDChange = (event) => {
        setid(event.target.value);
    };

    const handleCourseCodeChange = (event) => {
        setCourseCode(event.target.value);
    }

    function validateID() {
        if (id.trim().length !== 5 && id.length !== 0) {
            return false;
        }

        for (let i = 0; i < id.trim().length; i++) {
            if (id[i] < '0' || id[i] > '9') {
                return false;
            }
        }
        
        return true;
    }

    function validateCourse() {
        if (courseCode.length === 0) {
            return true;
        }

        var temp = courseCode.trim().split(/\s+/);

        // make sure there is just dept and course code
        if (temp.length !== 2) {
            return false;
        }

        var curDept = temp[0].toUpperCase();
        var curCourseCode = temp[1].toUpperCase();

        // parses dept correctly to search if it's a valid dept
        if (!depts.has(curDept)) {
            return false
        }

        // course code should be 3-4 characters, 4th char has to be letter
        if (curCourseCode.length !== 3 && curCourseCode.length !== 4) {
            return false;
        }

        for (let i = 0; i < curCourseCode.length; i++) {
            if (i === 3) {
                if (curCourseCode[i] < 'A' || curCourseCode[i] > 'Z') {
                    return false;
                }
            }
            else if (curCourseCode[i] < '0' || curCourseCode[i] > '9') {
                return false;
            }
        }

        return true;
    }

    function handleIDFocus() {
        IDRef.current.select()
    }

    function handleCourseFocus() {
        courseRef.current.select()
    }

    return (
        <Container className="pt-3">
            <Form onSubmit={handleIDSubmit}>
                <Form.Group controlId="formId">
                    <Form.Label>Unique 5 Digit Course ID</Form.Label>
                    <Form.Control type="text" name="id" placeholder="Ex. 32460" ref={IDRef} onFocus={handleIDFocus}
                    onChange={handleIDChange} className={validateID() ? 'is_valid' : 'is-invalid'} size='lg'/>
                </Form.Group>
                <Row>
                    <Col>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Col>
                    <Col className="pt-4">
                        <h3>OR</h3>
                    </Col>
                </Row>
            </Form>
            <Form onSubmit={handleCourseSubmit}>
                <Form.Group controlId="formId">
                    <Form.Label>Class Dept and Code</Form.Label>
                    <Form.Control type="text" name="id" placeholder="Ex. CS 439H" ref={courseRef} onFocus={handleCourseFocus}
                    onChange={handleCourseCodeChange} className={validateCourse() ? 'is_valid' : 'is-invalid'} size='lg'/>
                </Form.Group>
                <Row>
                    <Col>
                        <Button variant="primary" type="submit" className="mb-3">
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Form>
            <Container className="text-center">
                {coursesProfs.map((courseProf) => {
                    return <CourseProfCard courseProf={courseProf}
                    onClick={(course, prof, dept, courseCode, groupMeUrl) => handleCourseProfSelection(course, prof, dept, courseCode, groupMeUrl)} 
                    key={courseProf.course + courseProf.prof}/>;
                })}
                <Row className="pt-3">
                    <Col>
                        {errorMessage ? <h3>{errorMessage}</h3> : null}
                    </Col>
                </Row>
                <Row className="pt-3">
                    <Col>
                        {course ? <h3>Course: {course}</h3> : null}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {prof ? <h3>Professor: {prof}</h3> : null}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {share_url ? <LinkButton link={share_url}>GroupMe Link</LinkButton> : null}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {imageUrl ? <img src={imageUrl} alt="QR Code should be here :(" style={{width:"250px",height:"250px"}}/> : null}
                    </Col>
                </Row>
            </Container>
        </Container>
    )
}

export default Input;
