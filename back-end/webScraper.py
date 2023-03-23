from pymongo import MongoClient
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import requests
import os

# env variables, setting up Mongo connection and GroupMe token
load_dotenv()
client = MongoClient("mongodb+srv://" + os.getenv("MONGO_USER") + ":" + os.getenv("MONGO_TOKEN") + 
                     "@profcourse.1l1grej.mongodb.net/?retryWrites=true&w=majority", tls=True,
                                tlsAllowInvalidCertificates=True)
db = client['coursesProfs']
collection = db['Spring2023']
groupMe_token = os.getenv("GROUPME_TOKEN")
app_token = os.getenv("APP_TOKEN")

# used only when scrapingData and pushing it to MongoDB database
coursesProfs = {}


# ProfCourse object which is stored in MongoDB for each prof course combo
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

# for testing
def delete_group(courseProf):
    confirmation = input('You are trying to delete every GroupMe. Enter "Yes delete all GroupMes." to proceed')
    if confirmation != 'Yes delete all GroupMes.':
        return
    headers = {'Content-Type': 'application/json', 'X-Access-Token': groupMe_token}
    requests.post('https://api.groupme.com/v3/groups/' + courseProf.groupMe['id'] + '/destroy', headers=headers)
    #r = requests.post('https://api.groupme.com/v3/groups/92404620/destroy', headers=headers)
    #r = requests.get('https://api.groupme.com/v3/groups/92404620/destroy?token=4d2d3cf09548013bf6670242ac110002')

    newValues = {'$set': {'groupMe': {}}}
    query = {'prof': courseProf.prof, 'course': courseProf.course, 'courseNumber': courseProf.courseNumber, 'dept': courseProf.dept}
    collection.update_one(query, newValues)

    return "deleted"


def deleteAllGroupMes() :
    results = collection.find()
    for doc in results:
        curCourseProf = ProfCourse(doc['prof'], doc['course'], doc['dept'], doc['courseNumber'], doc['year'], doc['season'], doc['groupMe'])
        if (len(curCourseProf.groupMe) != 0) :
            delete_group(curCourseProf)



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

    '''
    with open('courseDepts.txt', 'w') as f: 
        f.write("[")
        for i in classCategories:
            f.write("'" + i + "', ")

        f.write("]")

        f.close()
    return
    '''
    
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
                    dept = td_tag.text.replace(" ", "")

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



# build the mongoDB database from courseProfs hashMap. scrapeData() should've been called before
def buildMongoDBData():
    toInsert = [vars(courseProf) for courseProf in coursesProfs]    
    result = collection.insert_many(toInsert)
    print(result.inserted_ids)


def main():
    #deleteAllGroupMes(
    scrapeData()
    #buildMongoDBData(

main()