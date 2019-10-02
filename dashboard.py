import datetime
import re

import mysql.connector
from PIL import Image
from flask import Flask, render_template, request
from flask import jsonify
from pyzbar.pyzbar import decode

app = Flask(__name__)
app.secret_key = 'key'
EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')


# --------------------------------- HTML Templates ----------------------------------------

@app.route('/', methods=['GET'])
def index():
    students = get_all_students()
    time = []
    for student in students:
        time_in, time_out = check_time_in_attendance(student[1])
        if time_in is False and time_out is False:
            time.append('Check In')
        elif time_in is True and time_out is False:
            time.append('Check Out')
        else:
            time.append('Checked Out')
    return render_template('index.html', students=students, time=time)


@app.route('/student/page/<qrcode>', methods=['GET'])
def student_page(qrcode):
    # get student info here
    student = get_student(qrcode)
    if student == 404:
        return render_template('student404.html')
    if student[2]:
        parent1 = get_parent(student[2])
    if student[3]:
        parent2 = get_parent(student[3])
    return render_template('student.html', student=student, parent1=parent1, parent2=parent2)


@app.route('/parent/page/<parent>', methods=['GET'])
def parent_page(parent):
    parent = parent
    return render_template('parent.html')


@app.route('/parent/form1', methods=['GET'])
def render_parent_form1():
    return render_template('addparent1.html')


@app.route('/parent/form2', methods=['POST'])
def render_parent_form2():
    parent1 = {
        'first_name': request.form['first_name'],
        'middle_name': request.form['middle_name'],
        'last_name': request.form['last_name'],
        'carrier': request.form['carrier'],
        'phone_number': request.form['phone_number'],
        'email': request.form['email'],
        'emailing': request.form.get('emailing'),
        'texting': request.form.get('texting'),
        'guardian': request.form['guardian'],
        'notes': request.form['notes']
    }
    print(parent1)
    return render_template('addparent2.html')


@app.route('/student/form', methods=['POST'])
def render_student_form():
    # parent1 = request.form['parent1']
    # parent2 = None
    # if(request.form['p2']):
    #     parent2 = {
    #         'first_name': request.form['first_name'],
    #         'middle_name': request.form['middle_name'],
    #         'last_name': request.form['last_name'],
    #         'carrier': request.form['carrier'],
    #         'phone_number': request.form['phone_number'],
    #         'email': request.form['email'],
    #         'emailing': request.form['emailing'],
    #         'texting': request.form['texting'],
    #         'guardian': request.form['guardian'],
    #         'notes': request.form['notes']
    #     }
    # if(request.form[new_student]):
    #     student = {
    #         "parent_1_id": request.form["parent_1_id"],
    #         "parent_2_id": request.form["parent_2_id"],
    #         "student_id": request.form["student_id"],
    #         "first_name": request.form["first_name"],
    #         "middle_name": request.form["middle_name"],
    #         "last_name": request.form["last_name"],
    #         "math": request.form["math"],
    #         "reading": request.form["reading"],
    #         "notes": request.form["notes"],
    #         "qrcode": request.form["qrcode"]
    #     }
    #     students.append(student)
    # may need some logic in rendering this form more than once for adding more than 1 student at a time
    return render_template('addstudent.html')


# --------------------------------- Internal Functions ----------------------------------------

def connect():
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        passwd="password",
        database="mydb"
    )
    return mydb


# return student id based on qrcode
def get_student_id(qrcode):
    mydb = connect()
    mycursor = mydb.cursor()
    sql = "SELECT student_id FROM students WHERE qrcode='" + str(qrcode) + "';"
    mycursor.execute(sql)
    student_id = mycursor.fetchone()[0]
    if student_id:
        return student_id
    return None


# scans qrcode and returns value
def scan_student(imgPath):
    return decode(Image.open(imgPath))


# check if student has checked in already
def check_time_in_attendance(student_id):
    mydb = connect()
    try:
        mycursor = mydb.cursor()
        sql = "SELECT * FROM time WHERE student_id = %s AND date(time_in) = CURDATE();" % student_id
        mycursor.execute(sql)
        latest = mycursor.fetchone()
        if latest is not None:
            sql = "SELECT * FROM time WHERE student_id = %s AND date(time_out) = CURDATE();" % student_id
            mycursor.execute(sql)
            latest = mycursor.fetchone()
            if latest is not None:
                return True, True
            return True, False
    except mysql.connector.Error as error:
        print("Failed selecting record from time table: {}".format(error))
    return False, False


# this function creates sql statement with values only if variables are not null
def edit_SQL_statement(data):
    sql = ""
    for key, value in data.items():
        if value != "":
            sql = sql + key + "='" + value + "',"
    sql = sql[:-1]
    return sql


# --------------------------------- Parent Functions ----------------------------------------

@app.route('/parent/all', methods=['GET'])
def get_all_parents():
    mydb = connect()
    mycursor = mydb.cursor()
    mycursor.execute("SELECT * FROM parents")
    parents = mycursor.fetchall()
    return jsonify(parents), 200


@app.route('/parent/one/<parent_id>', methods=['GET'])
def get_parent(parent_id):
    try:
        mydb = connect()
        mycursor = mydb.cursor()
        sql = "SELECT * FROM parents WHERE id = %s;" % parent_id
        mycursor.execute(sql)
        parent = mycursor.fetchone()
        return parent
    except mysql.connector.Error as error:
        return 404


@app.route('/parent/add', methods=['POST'])
def add_parent():
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
    print(data)
    mydb = connect()
    try:
        mycursor = mydb.cursor()
        sql = "INSERT INTO `mydb`.`parents` (`first_name`, `middle_name`, `last_name`, `carrier`, `phone_number`, " \
              "`email`, `messaging`, `emailing`, `guardian`, `notes`) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s); "
        val = (data['first'], data['middle'], data['last'], data['carrier'], data['phone_number'], data['email'],
               data['messaging'], data['emailing'], data['guardian'], data['notes'])
        mycursor.execute(sql, val)
        print("Parent Table: successfully inserted", data['first'], data['last'])
        mydb.commit()
        return jsonify(mycursor.lastrowid)
    except mysql.connector.Error as error:
        mydb.rollback()
        print("Failed inserting record into parent table: {}".format(error))
    return "error"


@app.route('/parent/edit', methods=['PUT'])
def edit_parent():
    parent_id = request.form["parent_id"]
    data = {
        "first_name": request.form["first_name"],
        "middle_name": request.form["middle_name"],
        "last_name": request.form["last_name"],
        "carrier": request.form["carrier"],
        "phone_number": request.form["phone_number"],
        "email": request.form["email"],
        "messaging": request.form["messaging"],
        "emailing": request.form["emailing"],
        "guardian": request.form["guardian"],
        "notes": request.form["notes"]
    }
    columns = edit_SQL_statement(data)
    mydb = connect()
    try:
        mycursor = mydb.cursor()
        sql = "UPDATE parents SET " + columns + " WHERE id = " + parent_id + ";"
        mycursor.execute(sql)
        mydb.commit()
        print("Parent, %s %s successfully updated" % (data['first_name'], data['last_name']))
        return (jsonify(columns))
    except mysql.connector.Error as error:
        mydb.rollback()
        print("Failed updating record in parent table: {}".format(error))
    return "error"


@app.route('/parent/delete', methods=['DELETE'])
def delete_parent():
    data = {
        "parent_id": request.form["parent_id"]
    }
    mydb = connect()
    try:
        mycursor = mydb.cursor()
        val = data["parent_id"]
        sql = "DELETE FROM parents WHERE parent_id = %s;" % (val)
        mycursor.execute(sql)
        mydb.commit()
        sql = "SELECT * FROM parents WHERE parent_id = %s;" % (val)
        mycursor.execute(sql)
        records = mycursor.fetchall()
        if (len(records) == 0):
            return "Successfully deleted parent record: %s" % (data["parent_id"])
    except mysql.connector.Error as error:
        mydb.rollback()
        print("Failed to delete record from parent table: {}".format(error))
    return "error"


@app.route('/language/add', methods=['POST'])
def add_language():
    data = {
        "parent_id": request.form["parent_id"],
        "language": request.form["language"]
    }
    mydb = connect()
    try:
        mycursor = mydb.cursor()
        sql = "SELECT * FROM language WHERE parent_id = %s AND language = %s"
        val = (data["parent_id"], data["language"])
        mycursor.execute(sql, val)
        exists = mycursor.fetchall()
        if len(exists) == 0:
            sql = "INSERT INTO `mydb`.`language` (`parent_id`, `language`) VALUES (%s, %s);"
            val = (data["parent_id"], data["language"])
            mycursor.execute(sql, val)
            mydb.commit()
            return "Language %s successfully inserted to parent %s" % (data["language"], data["parent_id"])
        else:
            return "Record of Parent: %s speaking %s already exists" % val
    except mysql.connector.Error as error:
        mydb.rollback()
        print("Failed inserting record into parent table: {}".format(error))
        return "error"
    return "success"


@app.route('/language/delete', methods=['DELETE'])
def delete_language():
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
        mycursor.commit()
        sql = "SELECT * FROM language WHERE `parent_id` = %s, `language` = %s;"
        mycursor.execute(sql, val)
        records = mycursor.fetchall()
        if len(records) == 0:
            return "Successfully deleted language record: %s, %s", data["parent_id"], data["language"]
    except mysql.connector.Error as error:
        mydb.rollback()
        print("Failed to delete record from parent table: {}".format(error))
    return "error"


# --------------------------------- Student Functions ----------------------------------------

@app.route('/student/all', methods=['GET'])
def get_all_students():
    mydb = connect()
    mycursor = mydb.cursor()
    mycursor.execute("SELECT * FROM students")
    students = mycursor.fetchall()
    return students


@app.route('/student/one/<qrcode>', methods=['GET'])
def get_student(qrcode):
    try:
        mydb = connect()
        mycursor = mydb.cursor()
        sql = "SELECT * FROM students WHERE qrcode=%s" % qrcode
        mycursor.execute(sql)
        student = mycursor.fetchone()
        return student
    except mysql.connector.Error as error:
        return 404


@app.route('/student/add', methods=['POST'])
def add_student():
    data = {
        "parent_1_id": request.form["parent_1_id"],
        "parent_2_id": request.form["parent_2_id"],
        "student_id": request.form["student_id"],
        "first_name": request.form["first_name"],
        "middle_name": request.form["middle_name"],
        "last_name": request.form["last_name"],
        "math": request.form["math"],
        "reading": request.form["reading"],
        "notes": request.form["notes"],
        "qrcode": request.form["qrcode"]
    }
    mydb = connect()
    try:
        mycursor = mydb.cursor()
        sql = "INSERT INTO `mydb`.`students` (`parent_1_id`, `parent_2_id`, `student_id`, `first_name`, " \
              "`middle_name`, `last_name`, `math`, `reading`, `notes`, `qrcode`) VALUES (%s, %s, %s, %s, %s, %s, %s, " \
              "%s, %s, %s); "
        val = (data["parent_1_id"], data["parent_2_id"], data["student_id"], data["first_name"], data["middle_name"],
               data["last_name"], data["math"], data["reading"], data["notes"], data["qrcode"])
        mycursor.execute(sql, val)
        print("Student, %s %s, successfully inserted", data["first_name"], data["last_name"])
        mydb.commit()
        return "success"
    except mysql.connector.Error as error:
        mydb.rollback()
        print("Failed inserting record into student table: {}".format(error))
    return "error"


@app.route('/student/edit', methods=['PUT'])
def edit_student():
    student_id = request.form["student_id"]
    data = {
        "parent_1_id": request.form["parent_1_id"],
        "parent_2_id": request.form["parent_2_id"],
        "first_name": request.form["first_name"],
        "middle_name": request.form["middle_name"],
        "last_name": request.form["last_name"],
        "math": request.form["math"],
        "reading": request.form["reading"],
        "notes": request.form["notes"],
        "qrcode": request.form["qrcode"]
    }
    columns = edit_SQL_statement(data)
    mydb = connect()
    try:
        mycursor = mydb.cursor()
        mycursor.execute(sql)
        print("Student, %s %s %s, successfully edited" % (data["first_name"], data["last_name"], student_id))
        mydb.commit()
        return jsonify(columns)
    except mysql.connector.Error as error:
        mydb.rollback()
        print("Failed editing record in student table: {}".format(error))
    return "error"


@app.route('/student/delete', methods=['DELETE'])
def delete_student():
    data = {
        "student_id": request.form["student_id"]
    }
    mydb = connect()
    try:
        mycursor = mydb.cursor()
        val = data["student_id"]
        sql = "DELETE FROM students WHERE student_id = %s;" % (val)
        mycursor.execute(sql)
        mydb.commit()
        sql = "SELECT * FROM students WHERE student_id = %s;" % (val)
        mycursor.execute(sql)
        records = mycursor.fetchall()
        if len(records) == 0:
            return "Successfully deleted student record: %s" % (data["student_id"])
    except mysql.connector.Error as error:
        mydb.rollback()
        print("Failed to delete record from student table: {}".format(error))
    return "error"


@app.route('/time_in_out', methods=['POST'])
def time_in_out():
    data = {
        "student_id": '',
        "qrcode": request.form['qrcode']
    }
    data['student_id'] = get_student_id(data['qrcode'])
    checked_in, checked_out = check_time_in_attendance(data['student_id'])
    mydb = connect()
    try:
        now = datetime.datetime.now()
        formatted_datetime = "%s/%s/%s - %s:%s:%s" % (
            str(now.month), str(now.day), str(now.year), str(now.hour), str(now.minute), str(now.second))
        mycursor = mydb.cursor()
        val = data['qrcode']
        if checked_in and checked_out:
            return "Student has already checked out"
        elif checked_in:
            sql = "INSERT INTO time (student_id, time_out) VALUES ((SELECT student_id FROM students WHERE qrcode = " \
                  "%s), NOW())" % val
        else:
            sql = "INSERT INTO time (student_id, time_in) VALUES ((SELECT student_id FROM students WHERE qrcode = " \
                  "%s), NOW())" % val
        mycursor.execute(sql)
        mydb.commit()
        return ("Time successfully inserted into column for student %s: %s" % (
            get_student_id(data['qrcode']), formatted_datetime))
    except mysql.connector.Error as error:
        mydb.rollback()
        print("Failed inserting record into time table: {}".format(error))
    return "error"


app.run(debug=True)
