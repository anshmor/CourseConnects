from flask import Flask, request
from pymongo import MongoClient
from bs4 import BeautifulSoup
import requests

app = Flask(__name__)
coursesProfs = {}
idToCourseProf = {}

class ProfCourse:
    def __init__(self, prof, course, dept, courseNumber, year, season, groupMe):
        self.prof = prof
        self.course = course
        self.dept = dept
        self.courseNumber = courseNumber
        self.year = year
        self.season = season
        self.ids = []
        self.groupMe = groupMe
        

    def __eq__(self, obj):
        return isinstance(obj, ProfCourse) and self.prof == obj.prof and self.course == obj.course

    def __str__(self):
        return self.dept + " " + self.courseNumber + " " + self.course + ": " + self.prof + "; " + self.season + ", " + self.year + " " + str(self.ids)

    def __hash__(self):
        return hash(str(self))

def scrapeData():
    url = 'https://utdirect.utexas.edu/apps/student/coursedocs/nlogon/?year=2023&semester=2&department=&course_number=&course_title=&unique=&instructor_first=&instructor_last=&course_type=In+Residence&search=Search'
    response = requests.get(url)
    html = response.content
    soup = BeautifulSoup(html, 'html.parser')

    classCategories = []

    # get all the course categories
    for option in soup.find_all('option'):
        optionString: str = option.text
        temp: int = optionString.find("-")
        if (temp == 3):
            classCategories.append(optionString[:3].replace(" ", "+"))


    # hit the url with each possible course category and get all courses and associated professors
    for classCategory in classCategories:
        url = "https://utdirect.utexas.edu/apps/student/coursedocs/nlogon/?year=2023&semester=2&department=" + classCategory + "&course_number=&course_title=&unique=&instructor_first=&instructor_last=&course_type=In+Residence&search=Search"
        response = requests.get(url)
        html = response.content
        soup = BeautifulSoup(html, 'html.parser')
        for tr_tag in soup.find_all('tr'):
            index = 0
            prof = ""
            course = ""
            dept = ""
            courseNumber = ""
            courseId = ""
            year = ""
            season = ""
            for td_tag in tr_tag.find_all('td'):

                # year and season is first tag
                if index == 0:
                    yearAndSeason = td_tag.text.split(', ')
                    if len(yearAndSeason) == 2 and len(yearAndSeason[0]) == 4:
                        year = yearAndSeason[0].strip()
                        season = yearAndSeason[1].strip()

                # dept is seconnd td tag
                if index == 1:
                    dept = td_tag.text

                # courseNumber is third td tag
                elif index == 2:
                    courseNumber = td_tag.text

                # course title is fourth td tag
                elif index == 3:
                    courseUnformatted = td_tag.text
                    # all courses end with a .
                    if (courseUnformatted.endswith(".")):
                        # get rid of the '.' at end of course name
                        course = courseUnformatted[:len(courseUnformatted)-1]
                    else:
                        # if text didn't end with a '.' then it's not a course and we go to next tr_tag
                        break

                elif index == 4:
                    courseId = td_tag.text
                
                # professor is sixth td tag
                elif index == 5:
                    a_tag = td_tag.find('a')
                    # sometimes prof isn't in an a tag and is just text in td tag
                    try:
                        profUnformatted = a_tag.text
                        # gets rid of text after prof name
                        prof = profUnformatted[:profUnformatted.find('CV')].strip()
                    
                    except:
                        prof = td_tag.text.strip()
                    
                    break
                
                index += 1

        
            if (prof != "" and course != ""):
                curProfCourse = ProfCourse(prof, course, dept, courseNumber, year, season, {})
                # if current prof and course already in dict, add current id to that object
                lookup = course + prof + dept + courseNumber
                if lookup in coursesProfs:
                    coursesProfs[lookup].ids.append(courseId)
                    
                # otherwise add the current prof and course object to dictionary
                else:
                    curProfCourse.ids.append(courseId)
                    coursesProfs[lookup] = curProfCourse


    # write all course and prof combos to text file
    with open('profCourses.txt', 'w') as f: 
        for i in coursesProfs:
            curCourseProf = coursesProfs[i]
            f.write(str(curCourseProf) + '\n')
        f.close()

@app.route("/")
def hello():
    return "Hello World!"

access_token = '4d2d3cf09548013bf6670242ac110002'

@app.route("/create")
def create_group():
    payload = {'name': 'test4', 'share': True, 'image_url': 'https://i.groupme.com/123456789'}
    headers = {'Content-Type': 'application/json', 'X-Access-Token': access_token}
    r = requests.post('https://api.groupme.com/v3/groups', json=payload, headers=headers)
    #r = requests.post('https://api.groupme.com/v3/groups/92404620/destroy', headers=headers)
    #r = requests.get('https://api.groupme.com/v3/groups/92404620/destroy?token=4d2d3cf09548013bf6670242ac110002')
    return r.json()

@app.route('/delete')
def delete_group():
    headers = {'Content-Type': 'application/json', 'X-Access-Token': access_token}
    requests.post('https://api.groupme.com/v3/groups/92405151/destroy', headers=headers)
    return "deleted"

def buildMongoDBData():
    client = MongoClient("mongodb+srv://papbo:Xb6VsAPeRTbux9Dw@profcourse.1l1grej.mongodb.net/?retryWrites=true&w=majority", tls=True,
                                tlsAllowInvalidCertificates=True)
    db = client['coursesProfs']
    collection = db['coursesProfs']
    for i in coursesProfs:
        collection.insert_one(vars(coursesProfs[i]))
        #collection.insert_one({"name": "bob", "profession": "software engineer"})
        break


def buildDictFromMongoDB():
    client = MongoClient("mongodb+srv://papbo:Xb6VsAPeRTbux9Dw@profcourse.1l1grej.mongodb.net/?retryWrites=true&w=majority", tls=True,
                                tlsAllowInvalidCertificates=True)
    db = client['coursesProfs']
    collection = db['coursesProfs']

    
    results = collection.find()
    for doc in results:
        curCourseProf = ProfCourse(doc['prof'], doc['course'], doc['dept'], doc['courseNumber'], doc['year'], doc['season'], doc['groupMe'])
        for i in doc['ids']:
            idToCourseProf[i] = curCourseProf
            curCourseProf.ids.append(i)

def createGroupMe():
    client = MongoClient("mongodb+srv://papbo:Xb6VsAPeRTbux9Dw@profcourse.1l1grej.mongodb.net/?retryWrites=true&w=majority", tls=True,
                                tlsAllowInvalidCertificates=True)
    db = client['coursesProfs']
    collection = db['coursesProfs']

    for i in idToCourseProf:
        curCourseProf = idToCourseProf[i]

        # no groupMe link for current course
        if (len(curCourseProf.groupMe) == 0):
            # create groupMe for course
            payload = {'name': curCourseProf.course + ' ' + curCourseProf.prof, 'share': True, 'image_url': 'https://i.groupme.com/123456789'}
            headers = {'Content-Type': 'application/json', 'X-Access-Token': access_token}
            r = requests.post('https://api.groupme.com/v3/groups', json=payload, headers=headers).json()
            if (r['meta']['code'] != 201):
                print("Error occurred while trying to create GroupMe group.")
            else:
                groupMeResponse = r['response']
                # push it to mongoDB database
                groupMeDict = {'id': groupMeResponse['id'], 'share_url': groupMeResponse['share_url']}
                newValues = {'$set': {'groupMe': groupMeDict}}
                query = {'prof': curCourseProf.prof, 'course': curCourseProf.course, 'courseNumber': curCourseProf.courseNumber, 'dept': curCourseProf.dept}
                collection.update_one(query, newValues)

                # update local groupMe info in courseProf
                curCourseProf.groupMe = groupMeDict

def main():
    #scrapeData()
    #buildMongoDBData()
    buildDictFromMongoDB()
    createGroupMe()
    for i in idToCourseProf:
        print(i + ": " + str(idToCourseProf[i]))
        print(idToCourseProf[i].groupMe)
    if __name__ == "__main__":
	    app.run()

main()