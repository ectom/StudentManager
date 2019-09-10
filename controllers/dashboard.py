import mysql.connector

def connect():
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        passwd="password",
        database="mydb"
    )
    return mydb

def selectAllParents(mydb):
    mycursor = mydb.cursor()
    mycursor.execute("SELECT * FROM parents")
    parents = mycursor.fetchall()
    for parent in parents:
        print(parent)

def selectAllStudents(mydb):
    mycursor = mydb.cursor()
    mycursor.execute("SELECT * FROM students")
    students = mycursor.fetchall()
    return students
    # for student in students:
    #     print(student)


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
def commit(mydb):
    # mycursor = mydb.cursor()
    mydb.commit()
