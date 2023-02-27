from flask import Flask, request
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
app_token = os.getenv("APP_TOKEN")

# stores data pulled from MongoDB database and will be used to return proper course, prof, and groupMe
idToCourseProf = {}

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


# receives id from front end, returns corresponding course info and groupMe info
# if groupMe doesn't exist for requested id, create groupMe, update courseProf object in MongoDB
@app.route('/getGroup', methods=['POST'])
def getGroup():
    data = request.get_json()
    id = data.get('id')

    # ensure only my react front end can make calls
    request_token = data.get('app_token')
    if (request_token != app_token):
        return "Invalid app_token"
    
    if (id in idToCourseProf):
        courseProf = idToCourseProf[id]
        if (len(courseProf.groupMe) == 0):
            # create groupMe for course
            payload = {'name': courseProf.dept + " " + courseProf.courseNumber, 'share': True, 'image_url': 'https://i.groupme.com/123456789'}
            headers = {'Content-Type': 'application/json', 'X-Access-Token': groupMe_token}
            r = requests.post('https://api.groupme.com/v3/groups', json=payload, headers=headers).json()
            if (r['meta']['code'] != 201):
                print("Error occurred while trying to create GroupMe group.")
                print(r)
                return vars(ProfCourse(courseProf.prof, courseProf.course, courseProf.dept, courseProf.courseNumber,
                                        courseProf.year, courseProf.season, {'share_url': 'Error with your GroupMe link', 'id': ''}))

            else:
                groupMeResponse = r['response']
                # push it to mongoDB database
                groupMeDict = {'id': groupMeResponse['id'], 'share_url': groupMeResponse['share_url']}
                newValues = {'$set': {'groupMe': groupMeDict}}
                query = {'prof': courseProf.prof, 'course': courseProf.course, 'courseNumber': courseProf.courseNumber, 'dept': courseProf.dept}
                collection.update_one(query, newValues)

                # update local groupMe info in courseProf
                courseProf.groupMe = groupMeDict
            
        return vars(courseProf)

    else:
        return vars(ProfCourse('','','','','','',{'share_url':'', 'id':''}))

    

# accesses mongoDB database and builds a hashMap from it
def buildDictFromMongoDB():
    results = collection.find()
    for doc in results:
        curCourseProf = ProfCourse(doc['prof'], doc['course'], doc['dept'], doc['courseNumber'], doc['year'], doc['season'], doc['groupMe'])
        for i in doc['ids']:
            idToCourseProf[i] = curCourseProf
            curCourseProf.ids.append(i)


def main():
    buildDictFromMongoDB()
    
    if __name__ == "__main__":
	    app.run()

main()