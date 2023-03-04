import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import QRCode from 'qrcode';
import CourseProfCard from './CourseProfCard';
import JoinGroupMe from './JoinGroupMe';
import './App.css';

function Input() {
    const [id, setid] = useState("");
    const [courseCode, setCourseCode] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [courseProf, setCourseProf] = useState(null);
    const [coursesProfs, setCoursesProfs] = useState([]);
    const [loading, setLoading] = useState(false);

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
        setImageUrl('');
        setCourseProf(null);
        setCoursesProfs([]);
        setErrorMessage('Error getting class information')
        console.error(error)
    };

    const handleCourseProfSelection = (courseProf) => {
        setErrorMessage('');
        setCoursesProfs([]);
        if (Object.keys(courseProf.groupMe).length === 0 ) {
            sendId(courseProf.ids[0]);

        }
        else {
            setCourseProf(courseProf);
        }
    }


    const handleIDSubmit = (event) => {
        event.preventDefault();
        setImageUrl('');
        setErrorMessage('');
        setCoursesProfs([]);
        setCourseProf(null);
        if (!validateID() || id.length === 0) {
            setErrorMessage('Invalid Input');
         }
        else {
            sendId(id.trim());
        }
    };

    function sendId(idToSend) {
        setLoading(true);
        axios.get(backend_uri + '/getGroup', {
            params: {
            id: idToSend
            }
            })
            .then((response) => {
                if (response.data.course === "") {
                    setErrorMessage('Course not found')
                }
                else if (response.data.groupMe.share_url.startsWith("Error")){
                    setErrorMessage(response.data.groupMe.share_url);
                }
                else {
                    setCourseProf(response.data);
                }
            })
            .catch((error) => {
                handleError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const handleCourseSubmit = (event) => {
        event.preventDefault();
        setCourseProf(null);
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
            setLoading(true);
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
                })
                .finally(() => {
                    setLoading(false);
                })
        }
    }

    useEffect(() => {
        // generate qr code
        if (courseProf) {
            console.log(courseProf.groupMe.share_url);
            QRCode.toDataURL(courseProf.groupMe.share_url)
            .then((response) => {
                setImageUrl(response)
            })
            .catch((error) => {
                console.error(error)
                setImageUrl('');
            })
        }
    }, [courseProf])

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

    return (
        <Container className="pt-3">
            <Form onSubmit={handleIDSubmit}>
                <Form.Group controlId="formId">
                    <Form.Label>Unique 5 Digit Course ID</Form.Label>
                    <Form.Control type="text" name="id" placeholder="Ex. 32460" ref={IDRef} onFocus={() => IDRef.current.select()}
                    onChange={(event) => setid(event.target.value)} className={validateID() ? 'is_valid' : 'is-invalid'} size='lg'/>
                </Form.Group>
                <Row>
                    <Col>
                        <Button variant="primary" className="my-button" type="submit">
                            Submit
                        </Button>
                    </Col>
                    <Col className="pt-4">
                        <h3>OR</h3>
                    </Col>
                </Row>
            </Form>
            <Form onSubmit={handleCourseSubmit}>
                <Form.Group controlId="formCourseCode">
                    <Form.Label>Class Dept and Code</Form.Label>
                    <Form.Control type="text" name="id" placeholder="Ex. CS 439H" ref={courseRef} onFocus={() => courseRef.current.select()}
                    onChange={(event) => setCourseCode(event.target.value)} className={validateCourse() ? 'is_valid' : 'is-invalid'} size='lg'/>
                </Form.Group>
                <Row>
                    <Col>
                        <Button variant="primary" className="my-button mb-3" type="submit">
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Form>
            <Container className="text-center">
                {coursesProfs.map((courseProf) => {
                    return <CourseProfCard courseProf={courseProf}
                    onClick={(courseProf) => handleCourseProfSelection(courseProf)} 
                    key={courseProf.course + courseProf.prof}/>;
                })}
                {errorMessage &&
                <Row className="pt-3">
                    <Col>
                        <h3>{errorMessage}</h3>
                    </Col>
                </Row>
                }
                {loading &&
                    <Row className="pt-3">
                        <Col>
                            <h3>Loading...</h3>
                        </Col>
                    </Row>
                }
                {courseProf &&
                <JoinGroupMe courseProf={courseProf} imageUrl={imageUrl}/>
                }
            </Container>
        </Container>
    )
}

export default Input;
