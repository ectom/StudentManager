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

def connect():
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        passwd="password",
        database="mydb"
    )
    return mydb


# return student id based on qrcode
def getStudentID(qrcode):
    mydb = connect()
    mycursor = mydb.cursor()
    sql = "SELECT student_id FROM students WHERE qrcode='" + str(qrcode) + "';"
    mycursor.execute(sql)
    student_id = mycursor.fetchone()[0]
    if(student_id):
        return student_id
    return None


# scans qrcode and returns value
def scanStudent(imgPath):
    return decode(Image.open(imgPath))


# check if student has checked in already
def checkTimeInAttendance(student_id):
    mydb = connect()
    try:
        mycursor = mydb.cursor()
        sql = "SELECT * FROM time WHERE student_id = %s AND date(time_in) = CURDATE();"
        val = (student_id)
        mycursor.execute(sql, val)
        latest = mycursor.fetchone()
        if(latest != None):
            return True
    except mysql.connector.Error as error:
        print("Failed selecting record from time table: {}".format(error))
    return False


# this function creates sql statement with values only if variables are not null
def editSQLStatement(data):
    sql = ""
    val = ""
    for key, value in data.items():
        if(value != None):
            sql = sql + "`" + key + "` = %s,"
            val = val + value + ","
    sql = sql[:-1]
    val = val[:-1]
    return sql, val

# --------------------------------- Parent Functions ----------------------------------------

@app.route('/parent/all', methods=['GET'])
def getAllParents():
    mydb = connect()
    mycursor = mydb.cursor()
    mycursor.execute("SELECT * FROM parents")
    parents = mycursor.fetchall()
    return jsonify(parents), 200


@app.route('/parent/one', methods=['POST'])
def getParent():
    data = {
        "first_name": request.form['first_name']
    }
    mydb = connect()
    print("wfefwvf",first_name)
    mycursor = mydb.cursor()
    mycursor.execute("SELECT * FROM parents WHERE first_name= '" + data["first_name"]+ "';")
    parents = mycursor.fetchall()
    for parent in parents:
        print(parent)
        if(parent[1]==first_name):
            return jsonify(parent), 200
    return "Parent not found", 404



@app.route('/parent/add', methods=['POST'])
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


@app.route('/parent/edit', methods=['PUT'])
def editParent():
    id = request.form["id"]
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
    columns, val = editSQLStatement(data)
    mydb = connect()
    try:
        mycursor = mydb.cursor()
        sql = "UPDATE students SET " + columns + " WHERE id = " + id +";"
        mycursor.execute(sql, val)
        print("Parent Table: successfully updated", data['first'], data['last'])
        return mycursor.lastrowid
    except mysql.connector.Error as error:
        mydb.rollback()
        print("Failed updating record in parent table: {}".format(error))
    return "error"


@app.route('/parent/delete', methods=['DELETE'])
def deleteParent():
    data = {
        "parent_id" : request.form["parent_id"]
    }
    mydb = connect()
    try:
        mycursor = mydb.cursor()
        sql = "DELETE FROM parents WHERE `parent_id` = %s;"
        val = data["parent_id"]
        mycursor.execute(sql, val)
        print("Successfully deleted parent record: %s", data["parent_id"])
        return "success"
    except mysql.connector.Error as error:
        mydb.rollback()
        print("Failed to delete record from parent table: {}".format(error))
    return "error"


@app.route('/language/add', methods=['POST'])
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


@app.route('/language/delete', methods=['DELETE'])
def deleteLanguage():
    data = {
        "parent_id": request.form["parent_id"],
        "language": request.form["language"]
    }
    mydb = connect()
    try:
        mycursor = mydb.cursor()
        sql = "DELETE FROM language WHERE `parent_id` = %s, `language` = %s;"
        val = (data["parent_id"], data["language"])
        mycursor.execute(sql, val)
        print("Successfully deleted language record: %s, %s", data["parent_id"], data["language"])
        return "success"
    except mysql.connector.Error as error:
        mydb.rollback()
        print("Failed to delete record from parent table: {}".format(error))
    return "error"


# --------------------------------- Student Functions ----------------------------------------

@app.route('/student/all', methods=['GET'])
def getAllStudents():
    mydb = connect()
    mycursor = mydb.cursor()
    mycursor.execute("SELECT * FROM students")
    students = jsonify(mycursor.fetchall())
    return students


@app.route('/student', methods=['POST'])
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


@app.route('/student/add', methods=['POST'])
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
        return "success"
    except mysql.connector.Error as error:
        mydb.rollback()
        print("Failed inserting record into student table: {}".format(error))
    return "error"


@app.route('/student/edit', methods=['PUT'])
def editStudent():
    student_id = request.form["student_id"]
    data = {
        "parent_1_id": request.form["parent_1_id"],
        "parent_2_id": request.form["parent_2_id"],
        "first": request.form["first"],
        "middle": request.form["middle"],
        "last": request.form["last"],
        "math": request.form["math"],
        "reading": request.form["reading"],
        "notes": request.form["notes"],
        "qrcode": request.form["qrcode"]
    }
    columns, val = editSQLStatement(data)
    mydb = connect()
    try:
        mycursor = mydb.cursor()
        sql = "UPDATE students SET "+ columns +" WHERE student_id = " + student_id + ";"
        mycursor.execute(sql, val)
        print("Student, %s %s %s, successfully edited", data["first"], data["last"], student_id)
        mydb.commit()
        return "success"
    except mysql.connector.Error as error:
        mydb.rollback()
        print("Failed editing record in student table: {}".format(error))
    return "error"


@app.route('/student/delete', methods=['DELETE'])
def deleteStudent():
    data = {
        "student_id" : request.form["student_id"]
    }
    mydb = connect()
    try:
        mycursor = mydb.cursor()
        sql = "DELETE FROM students WHERE `student_id` = %s;"
        val = data["student_id"]
        mycursor.execute(sql, val)
        print("Successfully deleted student record: %s", data["student_id"])
        return "success"
    except mysql.connector.Error as error:
        mydb.rollback()
        print("Failed to delete record from student table: {}".format(error))
    return "error"


@app.route('/timeInOut', methods=['POST'])
def timeInOut():
    data = {
        "student_id": '',
        "qrcode": request.form['qrcode']
    }
    data['student_id'] = getStudentID(data['qrcode'])
    checkedIn = checkTimeInAttendance(data['student_id'])
    time_column = ''
    mydb = connect()
    try:
        now = datetime.datetime.now()
        mycursor = mydb.cursor()
        if(checkedIn):
            time_column = 'time_out'
        else:
            time_column = 'time_in'
        sql = "INSERT INTO `mydb`.`time` (`student_id`, `%s`) VALUES (%s, %s)"
        val = (time_column, data['student_id'], now)
        mycursor.execute(sql, val)
        mydb.commit()
        print("Time successfully inserted into %s column for student %s at time %s", time_column, data['student_id'], now)
    except mysql.connector.Error as error:
        mydb.rollback()
        print("Failed inserting record into time table: {}".format(error))
        return "error"
    return "success"


app.run(debug=True)
