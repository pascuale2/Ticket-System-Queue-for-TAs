/*-----------------------*/
/* DROP TABLE STATEMENTS */
/*-----------------------*/
DROP TABLE [Queue];
DROP TABLE [Session];
DROP TABLE Teacher;
DROP TABLE Student;
DROP TABLE Discipline;
DROP TABLE Answer;
DROP TABLE Question;

/*-------------------------*/
/* CREATE TABLE STATEMENTS */
/*-------------------------*/
CREATE TABLE Discipline(
  discipline_id int NOT NULL PRIMARY KEY,
  discipline_name varchar(255)
);

CREATE TABLE Teacher(
  teacher_id int NOT NULL PRIMARY KEY,
  name varchar(255),
  discipline_id int FOREIGN KEY REFERENCES Discipline(discipline_id),
  available bit
);

CREATE TABLE Student(
  student_id int NOT NULL PRIMARY KEY,
  name varchar(255),
  biography varchar(255),
  discipline_id int FOREIGN KEY REFERENCES Discipline(discipline_id)
);

CREATE TABLE Question(
  question_id int NOT NULL PRIMARY KEY,
  question_string varchar(3000),
  question_status bit,
);

CREATE TABLE Answer(
  answer_id int NOT NULL PRIMARY KEY,
  answer_string varchar(3000),
  question_id int FOREIGN KEY REFERENCES Question(question_id)
);


CREATE TABLE [Session](
  session_id int NOT NULL PRIMARY KEY,
  course_id int NOT NULL,
  available_day varchar(20),
  from_time varchar(20),
  to_time varchar(20),
  teacher_id int FOREIGN KEY REFERENCES Teacher(teacher_id),
  zoom_link varchar(200),
  zoom_link_passwd varchar(200)
);

CREATE TABLE [Queue](
  queue_id int NOT NULL PRIMARY KEY,
  answer_ids varchar(3000),
  question_ids varchar(3000),
  student_ids varchar(3000),
  teacher_id int FOREIGN KEY REFERENCES Teacher(teacher_id),
  discipline_id int FOREIGN KEY REFERENCES Discipline(discipline_id),
  question_id int FOREIGN KEY REFERENCES Question(question_id),
  session_id int FOREIGN KEY REFERENCES Session(session_id)
);

/*-------------------------*/
/* INSERT VALUE STATEMENTS */
/*-------------------------*/
INSERT INTO Discipline(discipline_id,discipline_name) VALUES
	(100,'Biology'),
	(101,'Chemistry'),
	(102,'Computer Science'),
	(103,'Mathematics'),
	(104,'Earth and Planetary Science'),
	(105,'Physics'),
	(106,'Statistics'),
	(107,'Psychology'),
	(200,'Academic Advisor'),
	(201,'Registrar Advisor');

INSERT INTO Teacher([teacher_id],[name],[discipline_id],[available]) VALUES
	(4000000,'Hoyt Carrillo',104,'1'),
	(4000001,'Jaime Anderson',101,'1'),
	(4000002,'Amanda Ortiz',105,'1'),
	(4000003,'Blossom Hancock',106,'1'),
	(4000004,'Fritz Snider',107,'1'),
	(4000005,'Holmes Johnston',105,'1'),
	(4000006,'Stella Howard',105,'1'),
	(4000007,'Nash Calhoun',101,'1'),
	(4000008,'Orla Emerson',100,'1'),
	(4000009,'Alea Mcfadden',101,'1'),
	(4000010,'Yoshio Duffy',101,'1'),
	(4000011,'Cade Jenkins',102,'1'),
	(4000012,'Adrienne Russell',107,'1'),
	(4000013,'Sara Jones',106,'1'),
	(4000014,'Orli Waters',103,'1'),
	(4000015,'Urielle Fox',104,'1'),
	(4000016,'Kenyon Foley',107,'1'),
	(4000017,'Denise Gaines',106,'1'),
	(4000018,'Dylan Mcintosh',105,'1'),
	(4000019,'Rogan Pennington',106,'1'),
	(4000020,'Aline Johnston',104,'1'),
	(4000021,'Suki Valenzuela',100,'1'),
	(4000022,'Guinevere Decker',103,'1'),
	(4000023,'Quon Cleveland',103,'1'),
	(4000024,'Hall Love',107,'1'),
	(4000025,'Kim Terry',106,'1'),
	(4000026,'Gillian Walter',103,'1'),
	(4000027,'Jackson Gillespie',106,'1'),
	(4000028,'Mia Flynn',106,'1'),
	(4000029,'Xaviera Heath',100,'1'),
	(4000030,'Baxter Richards',103,'1'),
	(4000031,'Sigourney Steele',100,'1'),
	(4000032,'Idola Spencer',100,'1'),
	(4000033,'Amelia Fields',101,'1'),
	(4000034,'Davis Witt',102,'1'),
	(4000035,'Devin Gamble',103,'1'),
	(4000036,'Ina Mcfarland',105,'1'),
	(4000037,'Jared Hamilton',104,'1'),
	(4000038,'Tanek Ewing',104,'1'),
	(4000039,'Jasmine White',103,'1'),
	(4000040,'Vladimir Cotton',101,'1'),
	(4000041,'Graiden Copeland',100,'1'),
	(4000042,'Ebony Gross',104,'1'),
	(4000043,'Kennedy Combs',100,'1'),
	(4000044,'Christopher Little',101,'1'),
	(4000045,'Yoshi Patel',104,'1'),
	(4000046,'Yeo Bryan',103,'1'),
	(4000047,'Darius Dunn',103,'1'),
	(4000048,'Tarik Maynard',100,'1'),
	(4000049,'Cruz Rice',105,'1'),
	(4000050,'Gretchen Richards',106,'1'),
	(4000051,'Willard Norris',200,'1'),
	(4000052,'Amiyah Glass',201,'1'),
	(4000053,'Shanon Walton',200,'1'),
	(4000054,'Kali Key',201,'1');
