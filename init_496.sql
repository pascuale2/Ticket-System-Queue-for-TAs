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

CREATE TABLE Answer(
  answer_id int NOT NULL PRIMARY KEY,
  answer_string varchar(3000),
);

CREATE TABLE Question(
  question_id int NOT NULL PRIMARY KEY,
  question_string varchar(3000),
  question_status bit,
  answer_id int FOREIGN KEY REFERENCES Answer(answer_id)
);

CREATE TABLE Session(
  session_id int NOT NULL PRIMARY KEY,
  course_id int NOT NULL,
  available_day varchar(20),
  from_time varchar(20),
  to_time varchar(20),
  teacher_id int FOREIGN KEY REFERENCES Teacher(teacher_id),
  zoom_link varchar(200),
  zoom_link_passwd varchar(200)
);

CREATE TABLE Queue(
  queue_id int NOT NULL PRIMARY KEY,
  answer_ids varchar(3000),
  question_ids varchar(3000),
  student_ids varchar(3000),
  teacher_id int FOREIGN KEY REFERENCES Teacher(teacher_id),
  discipline_id int FOREIGN KEY REFERENCES Discipline(discipline_id),
  question_id int FOREIGN KEY REFERENCES Question(question_id),
  session_id int FOREIGN KEY REFERENCES Session(session_id)
);

