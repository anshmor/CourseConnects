from flask import Flask, request
from bs4 import BeautifulSoup
import requests

class ProfCourse:
    def __init__(self, prof, course, dept, courseNumber, year, season):
        self.prof = prof
        self.course = course
        self.dept = dept
        self.courseNumber = courseNumber
        self.year = year
        self.season = season
        self.ids = []
        

    def __eq__(self, obj):
        return isinstance(obj, ProfCourse) and self.prof == obj.prof and self.course == obj.course

    def __str__(self):
        return self.dept + " " + self.courseNumber + " " + self.course + ": " + self.prof + "; " + self.season + ", " + self.year + " " + str(self.ids)

    def __hash__(self):
        return hash(str(self))

def scrapeData():
    # set up for web scraping from html url
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
            # spaces are replaced with a '+' when course categeory appears in the URL
            classCategories.append(optionString[:3].replace(" ", "+"))


    # hit the url with each possible course category and get all courses and associated professors
    # coursesProfs = set()
    # idToCourse = {}
    coursesProfs = {}

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

                # dept is second td tag
                elif index == 1:
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
                curProfCourse = ProfCourse(prof, course, dept, courseNumber, year, season)
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

scrapeData()

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"

if __name__ == "__main__":
	app.run()