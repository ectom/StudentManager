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
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="password",
    database="mydb"
)

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


@app.route('/getParents', methods=['GET'])
def getAllParents():
    mycursor = mydb.cursor()
    mycursor.execute("SELECT * FROM parents")
    parents = mycursor.fetchall()
    print(parents)
    return jsonify(parents)


@app.route('/getParent', methods=['POST'])
def getParent():
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
    mycursor = mydb.cursor()
    mycursor.execute("SELECT * FROM students")
    students = jsonify(mycursor.fetchall())
    return students


@app.route('/getStudent', methods=['POST'])
def getStudent():
    first_name = request.form['first_name']
    mycursor = mydb.cursor()
    mycursor.execute("SELECT * FROM students WHERE first_name='"+first_name+"'")
    students = mycursor.fetchall()
    for student in students:
        print(student)
        if(student[1]==first_name):
            return jsonify(student), 200
    return "User not found", 404


def addParent(mydb, first, middle, last, carrier, phone_number, email, messaging, emailing, guardian, notes):
    try:
        mycursor = mydb.cursor()
        sql = "INSERT INTO `mydb`.`parents` (`first_name`, `middle_name`, `last_name`, `carrier`, `phone_number`, `email`, `messaging`, `emailing`, `guardian`, `notes`) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);"
        val = (first, middle, last, carrier, phone_number, email, messaging, emailing, guardian, notes)
        mycursor.execute(sql, val)
        print("Parent Table: successfully inserted", first, last)
        return mycursor.lastrowid
    except mysql.connector.Error as error:
        mydb.rollback()
        print("Failed inserting record into parent table: {}".format(error))
        return "error"
    return "success"


def addLanguage(mydb, parent_id, language):
    try:
        mycursor = mydb.cursor()
        sql = "INSERT INTO `mydb`.`language` (`parent_id`, `language`) VALUES (%s, %s);"
        val = (parent_id, language)
        mycursor.execute(sql, val)
        print("Language successfully inserted")
    except mysql.connector.Error as error:
        mydb.rollback()
        print("Failed inserting record into parent table: {}".format(error))
        return "error"
    return "success"


def addStudent(mydb, parent_1_id, parent_2_id, student_id, first, middle, last, math, reading, notes):
    try:
        mycursor = mydb.cursor()
        sql = "INSERT INTO `mydb`.`students` (`parent_1_id`, `parent_2_id`, `student_id`, `first_name`, `middle_name`, `last_name`, `math`, `reading`, `notes`) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);"
        val = (parent_1_id, parent_2_id, student_id, first, middle, last, math, reading, notes)
        mycursor.execute(sql, val)
        print("Student, %s %s, successfully inserted", first, last)
        # mycursor.commit()
    except mysql.connector.Error as error:
        mydb.rollback()
        print("Failed inserting record into student table: {}".format(error))
        return "error"
    return "success"


def displayTime(mydb, student_id):
    try:
        now = datetime.datetime.now()
        mycursor = mydb.cursor()
        sql = "INSERT INTO `mydb`.`time` (`student_id`, `time_in`) VALUES (%s, %s)"
        val = (student_id, now)
        mycursor.execute(sql, val)
        print("Time successfully inserted ", student_id, now)

    except mysql.connector.Error as error:
        mydb.rollback()
        print("Failed inserting record into time table: {}".format(error))
        return "error"
    return "success"


def commit(mydb):
    mydb.commit()


def scanStudent(imgPath):
    return decode(Image.open(imgPath))
# code = scanStudent('./qrcodes/2018-06-26_14-16-01_325.jpeg')
# displayTime(mydb, code)

app.run(debug=True)
