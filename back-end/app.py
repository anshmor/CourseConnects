from flask import Flask, request
from bs4 import BeautifulSoup
import requests

class ProfCourse:
    def __init__(self, prof, course, dept, courseNumber):
        self.prof = prof
        self.course = course
        self.dept = dept
        self.courseNumber = courseNumber
        

    def __eq__(self, obj):
        return isinstance(obj, ProfCourse) and self.prof == obj.prof and self.course == obj.course

    def __str__(self):
        return self.dept + " " + self.courseNumber + " " + self.course + ": " + self.prof

    def __hash__(self):
        return hash(str(self))

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
        classCategories.append(optionString[:3].replace(" ", "+"))


# hit the url with each possible course category and get all courses and associated professors
coursesProfs = set()
idToCourse = {}

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
        for td_tag in tr_tag.find_all('td'):
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

        # if we got a prof and course from this td tag add it to set
        if (prof != "" and course != ""):
            curProfCourse = ProfCourse(prof, course, dept, courseNumber)
            #print(curProfCourse)
            coursesProfs.add(curProfCourse)
            idToCourse[courseId] = curProfCourse

# write all course and prof combos to text file
with open('profCourses.txt', 'w') as f: 
    for i in coursesProfs:
        f.write(str(i) + '\n')
    f.close()

# write all id to courseProf combinations
with open('idToCourse.txt', 'w') as f: 
    for i in idToCourse:
        f.write(i + ": " + str(idToCourse[i]) + '\n')
    f.close()

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"

if __name__ == "__main__":
	app.run()