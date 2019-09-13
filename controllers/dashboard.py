import mysql.connector
from flask import Flask, render_template, request, redirect, flash, session
from flask import jsonify
from pyzbar.pyzbar import decode
from PIL import Image
import datetime
import re

app = Flask(__name__)
app.secret_key = 'key'
EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')

users = [
    {
        "name": "Nicholas",
        "age": 42,
        "occupation": "Network Engineer"
    },
    {
        "name": "Elvin",
        "age": 32,
        "occupation": "Doctor"
    },
    {
        "name": "Jass",
        "age": 22,
        "occupation": "Web Developer"
    }
]


def connect():
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        passwd="password",
        database="mydb"
    )
    return mydb


@app.route('/getParents', methods=['GET'])
def getAllParents():
    mydb = connect()
    mycursor = mydb.cursor()
    mycursor.execute("SELECT * FROM parents")
    parents = mycursor.fetchall()
    return jsonify(parents), 200


@app.route('/getParent', methods=['POST'])
def getParent():
    mydb = connect()
    first_name = request.form['first_name']
    print("wfefwvf",first_name)
    mycursor = mydb.cursor()
    mycursor.execute("SELECT * FROM parents WHERE first_name='"+first_name+"'")
    parents = mycursor.fetchall()
    for parent in parents:
        print(parent)
        if(parent[1]==first_name):
            return jsonify(parent), 200
    return "Parent not found", 404


@app.route('/getStudents', methods=['GET'])
def selectAllStudents():
    mydb = connect()
    mycursor = mydb.cursor()
    mycursor.execute("SELECT * FROM students")
    students = jsonify(mycursor.fetchall())
    return students


# student_id, qrcode
@app.route('/getStudent', methods=['POST'])
def getStudent():
    mydb = connect()
    data = {
        "qrcode": request.form['qrcode']
    }
    mycursor = mydb.cursor()
    mycursor.execute("SELECT * FROM students WHERE qrcode='" + data["qrcode"] + "'")
    student = mycursor.fetchone()
    if(student[10]==data["qrcode"]):
        return jsonify(student), 200
    return "User not found", 404


# first, middle, last, carrier, phone_number, email, messaging, emailing, guardian, notes
@app.route('/addParent', methods=['POST'])
def addParent():
    data = {
        "first": request.form["first"],
        "middle": request.form["middle"],
        "last": request.form["last"],
        "carrier": request.form["carrier"],
        "phone_number": request.form["phone_number"],
        "email": request.form["email"],
        "messaging": request.form["messaging"],
        "emailing": request.form["emailing"],
        "guardian": request.form["guardian"],
        "notes": request.form["notes"]
    }
    mydb = connect()
    try:
        mycursor = mydb.cursor()
        sql = "INSERT INTO `mydb`.`parents` (`first_name`, `middle_name`, `last_name`, `carrier`, `phone_number`, `email`, `messaging`, `emailing`, `guardian`, `notes`) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);"
        val = (data['first'], data['middle'], data['last'], data['carrier'], data['phone_number'], data['email'], data['messaging'], data['emailing'], data['guardian'], data['notes'])
        mycursor.execute(sql, val)
        print("Parent Table: successfully inserted", data['first'], data['last'])
        return mycursor.lastrowid
    except mysql.connector.Error as error:
        mydb.rollback()
        print("Failed inserting record into parent table: {}".format(error))
        return "error"
    return "success"


# parent_id, language
@app.route('/addLanguage', methods=['POST'])
def addLanguage():
    data = {
        "parent_id": request.form["parent_id"],
        "language": request.form["language"]
    }
    mydb = connect()
    try:
        mycursor = mydb.cursor()
        sql = "INSERT INTO `mydb`.`language` (`parent_id`, `language`) VALUES (%s, %s);"
        val = (data["parent_id"], data["language"])
        mycursor.execute(sql, val)
        print("Language successfully inserted")
    except mysql.connector.Error as error:
        mydb.rollback()
        print("Failed inserting record into parent table: {}".format(error))
        return "error"
    return "success"


# parent_1_id, parent_2_id, student_id, first, middle, last, math, reading, notes, qrcode
@app.route('/addStudent', methods=['POST'])
def addStudent():
    data = {
        "parent_1_id": request.form["parent_1_id"],
        "parent_2_id": request.form["parent_2_id"],
        "student_id": request.form["student_id"],
        "first": request.form["first"],
        "middle": request.form["middle"],
        "last": request.form["last"],
        "math": request.form["math"],
        "reading": request.form["reading"],
        "notes": request.form["notes"],
        "qrcode": request.form["qrcode"]
    }
    mydb = connect()
    try:
        mycursor = mydb.cursor()
        sql = "INSERT INTO `mydb`.`students` (`parent_1_id`, `parent_2_id`, `student_id`, `first_name`, `middle_name`, `last_name`, `math`, `reading`, `notes`, `qrcode`) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);"
        val = (data["parent_1_id"], data["parent_2_id"], data["student_id"], data["first"], data["middle"], data["last"], data["math"], data["reading"], data["notes"], data["qrcode"])
        mycursor.execute(sql, val)
        print("Student, %s %s, successfully inserted", data["first"], data["last"])
        mydb.commit()
    except mysql.connector.Error as error:
        mydb.rollback()
        print("Failed inserting record into student table: {}".format(error))
        return "error"
    return "success"


# student_id, qrcode
@app.route('/timeIn', methods=['POST'])
def displayTime():
    data = {
        "student_id": request.form['student_id'],
        "qrcode": request.form['qrcode']
    }
    mydb = connect()
    try:
        now = datetime.datetime.now()
        mycursor = mydb.cursor()
        sql = "INSERT INTO `mydb`.`time` (`student_id`, `time_in`) VALUES (%s, %s)"
        val = (data['student_id'], now)
        mycursor.execute(sql, val)
        mydb.commit()
        print("Time successfully inserted ", data['student_id'], now)
    except mysql.connector.Error as error:
        mydb.rollback()
        print("Failed inserting record into time table: {}".format(error))
        return "error"
    return "success"


def getStudentID(qrcode):
    mydb = connect()
    mycursor = mydb.cursor()
    sql = "SELECT student_id FROM students WHERE qrcode='" + str(qrcode) + "';"
    mycursor.execute(sql)
    student_id = mycursor.fetchone()[0]
    if(student_id):
        return student_id
    return None



def scanStudent(imgPath):
    return decode(Image.open(imgPath))
# code = scanStudent('./qrcodes/2018-06-26_14-16-01_325.jpeg')
# displayTime(mydb, code)

app.run(debug=True)
