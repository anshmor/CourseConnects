from flask import Flask, request, abort, jsonify
from pymongo import MongoClient
from flask_cors import CORS
from dotenv import load_dotenv
import os
import requests

app = Flask(__name__)
CORS(app)

# env variables, setting up Mongo connection and GroupMe token
load_dotenv()
client = MongoClient("mongodb+srv://" + os.getenv("MONGO_USER") + ":" + os.getenv("MONGO_TOKEN") + 
                     "@profcourse.1l1grej.mongodb.net/?retryWrites=true&w=majority", tls=True,
                                tlsAllowInvalidCertificates=True)
db = client['coursesProfs']
collection = db['Spring2023']
groupMe_token = os.getenv("GROUPME_TOKEN")

# stores data pulled from MongoDB database and will be used to return proper course, prof, and groupMe
idToCourseProf = {}
courseCodeToCourseProf = {}

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
        return isinstance(obj, ProfCourse) and self.prof == obj.prof and self.course == obj.course and self.dept == obj.dept and self.courseNumber == obj.courseNumber and self.season == obj.season and self.year == obj.year

    def __str__(self):
        toReturn = self.dept + " " + self.courseNumber + " " + self.course + ": " + self.prof + "; " + self.season + ", " + self.year + "\n" + str(self.ids)
        if len(self.groupMe) != 0 :
            toReturn += '\n' + self.groupMe['share_url'] + ' ' + self.groupMe['id']

        return toReturn

    def __hash__(self):
        return hash(str(self))

# gets all courseProfs that match inputted dept and courseCode
@app.route('/getGroupsCourseCode')
def getGroupCourseCode():
    referer = request.headers.get('Referer')
    # ensure only my react front end can make calls
    if referer != 'https://courseconnects.com/' and referer != 'https://www.courseconnects.com/' :
        abort(403)

    dept = request.args.get('dept')
    courseCode  = request.args.get('courseCode')

    if (dept in courseCodeToCourseProf):
        coursesProfsMatch = []
        if courseCode in courseCodeToCourseProf[dept] :
            coursesProfsMatch = courseCodeToCourseProf[dept][courseCode]
        
        # no exact match, see if anything course codes start with inputted code
        else :
            for courseNumber in courseCodeToCourseProf[dept]:
                if courseNumber.startswith(courseCode) :
                    for i in courseCodeToCourseProf[dept][courseNumber] :
                        coursesProfsMatch.append(i)

        if len(coursesProfsMatch) == 0:
            return "No Matches"
        
        return jsonify([vars(i) for i in coursesProfsMatch])
    
    else:
        return 'No Matches'



# receives id from front end, returns corresponding course info and groupMe info
# if groupMe doesn't exist for requested id, create groupMe, update courseProf object in MongoDB
@app.route('/getGroup')
def getGroup():
    referer = request.headers.get("Referer")
    # ensure only my react front end can make calls
    if referer != 'https://courseconnects.com/' and referer != 'https://www.courseconnects.com/' :
        abort(403)

    id = request.args.get('id')

    if (id in idToCourseProf):
        courseProf = idToCourseProf[id]

        # cache of server doesn't have groupMe data
        if len(courseProf.groupMe) == 0:

            # check if database has groupMe data
            query = {'course': courseProf.course, 'prof': courseProf.prof, 'courseNumber': courseProf.courseNumber, 'dept': courseProf.dept}
            result = collection.find_one(query)
            print(result)

            # database has no groupMe data, we genereate groupMe
            if len(result['groupMe']) == 0:
                # create groupMe for course
                profLastName = courseProf.prof[:courseProf.prof.index(',')]
                payload = {'name': courseProf.dept + " " + courseProf.courseNumber + " - " + profLastName, 'share': True, 'image_url': 'https://courseconnects.com/CCLogo.png'}
                headers = {'Content-Type': 'application/json', 'X-Access-Token': groupMe_token}
                r = requests.post('https://api.groupme.com/v3/groups', json=payload, headers=headers).json()

                # issue with groupMe API, possibly API token
                if (r['meta']['code'] != 201):
                    print("Error occurred while trying to create GroupMe group.")
                    print(r)
                    return vars(ProfCourse(courseProf.prof, courseProf.course, courseProf.dept, courseProf.courseNumber,
                                            courseProf.year, courseProf.season, {'share_url': 'Error with your GroupMe link', 'id': ''}))

                else:
                    groupMeResponse = r['response']
                    # push it to mongoDB database
                    groupMeDict = {'id': groupMeResponse['id'], 'share_url': groupMeResponse['share_url']}

                    # update cache with groupMe info in courseProf
                    courseProf.groupMe = groupMeDict

                    newValues = {'$set': {'groupMe': groupMeDict}}
                    collection.update_one(query, newValues)

            else :
                courseProf.groupMe = result['groupMe']
        
        return vars(courseProf)

    # id wasn't valid
    else:
        return vars(ProfCourse('','','','','','',{'share_url':'', 'id':''}))

    

# accesses mongoDB database and builds a hashMap from it
def buildDictFromMongoDB():
    # results = collection.find()
    # for doc in results:
    #     curCourseProf = ProfCourse(doc['prof'], doc['course'], doc['dept'], doc['courseNumber'], doc['year'], doc['season'], doc['groupMe'])
    #     for i in doc['ids']:
    #         idToCourseProf[i] = curCourseProf
    #         curCourseProf.ids.append(i)

    #     deptCourseNumber = curCourseProf.dept + curCourseProf.courseNumber

    #     if deptCourseNumber in courseCodeToCourseProf :
    #         courseCodeToCourseProf[deptCourseNumber].append(curCourseProf)
    #     else :
    #         courseCodeToCourseProf[deptCourseNumber] = []
    #         courseCodeToCourseProf[deptCourseNumber].append(curCourseProf)

    results = collection.find()
    for doc in results:
        curCourseProf = ProfCourse(doc['prof'], doc['course'], doc['dept'], doc['courseNumber'], doc['year'], doc['season'], doc['groupMe'])
        for i in doc['ids']:
            idToCourseProf[i] = curCourseProf
            curCourseProf.ids.append(i)

        
        if curCourseProf.dept in courseCodeToCourseProf :
            if curCourseProf.courseNumber not in courseCodeToCourseProf[curCourseProf.dept]:
                courseCodeToCourseProf[curCourseProf.dept][curCourseProf.courseNumber] = []

        else :
            courseCodeToCourseProf[curCourseProf.dept] = {}
            courseCodeToCourseProf[curCourseProf.dept][curCourseProf.courseNumber] = []

        courseCodeToCourseProf[curCourseProf.dept][curCourseProf.courseNumber].append(curCourseProf)
        


def main():
    buildDictFromMongoDB()
    if __name__ == '__main__':
        app.run()

main()