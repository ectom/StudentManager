import mysql.connector
from controllers.dashboard import selectAllParents

mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="password",
)
mycursor = mydb.cursor()

mycursor.execute("CREATE DATABASE IF NOT EXISTS mydb")
mycursor.execute("USE mydb")

parentTable = """CREATE TABLE IF NOT EXISTS parents(
    id int PRIMARY KEY auto_increment,
    first_name VARCHAR(255),
    middle_name VARCHAR(255),
    last_name VARCHAR(255),
    carrier VARCHAR(255),
    phone_number VARCHAR(255),
    email VARCHAR(255),
    messaging boolean NOT NULL,
    emailing boolean NOT NULL,
    guardian VARCHAR(255),
    notes TEXT
    );"""

studentTable = """CREATE TABLE IF NOT EXISTS `mydb`.`students` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `student_id` INT NULL,
  `parent_1_id` INT NULL,
  `parent_2_id` INT NULL,
  `first_name` VARCHAR(255) NULL,
  `middle_name` VARCHAR(255) NULL,
  `last_name` VARCHAR(255) NULL,
  `math` TINYINT NULL,
  `reading` TINYINT NULL,
  `notes` TEXT NULL,
  `qrcode` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  INDEX `parent_1_id_idx` (`parent_1_id` ASC) VISIBLE,
  INDEX `parent_2_id_idx` (`parent_2_id` ASC) VISIBLE,
  CONSTRAINT `parent_1_id`
    FOREIGN KEY (`parent_1_id`)
    REFERENCES `mydb`.`parents` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `parent_2_id`
    FOREIGN KEY (`parent_2_id`)
    REFERENCES `mydb`.`parents` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
"""

timeTable = """CREATE TABLE IF NOT EXISTS `mydb`.`time` (
  `id` INT NOT NULL,
  `student_id` INT NULL,
  `time_in` DATETIME NULL,
  `time_out` DATETIME NULL,
  PRIMARY KEY (`id`),
  INDEX `student_id_idx` (`student_id` ASC) VISIBLE,
  CONSTRAINT `student_id`
    FOREIGN KEY (`student_id`)
    REFERENCES `mydb`.`students` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);"""

languageTable = """CREATE TABLE IF NOT EXISTS `mydb`.`language` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `parent_id` INT DEFAULT NULL,
  `language` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  INDEX `parent_id_idx` (`parent_id` ASC) VISIBLE,
  CONSTRAINT `parent_id`
    FOREIGN KEY (`parent_id`)
    REFERENCES `mydb`.`parents` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);"""

mycursor.execute(parentTable)
mycursor.execute(studentTable)
mycursor.execute(timeTable)
mycursor.execute(languageTable)
mydb.commit()
