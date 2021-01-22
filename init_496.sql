CREATE TABLE Teacher(
  teacher_id int NOT NULL PRIMARY KEY,
  name varchar(255),
  discipline_id int FOREIGN KEY REFERENCES Discipline(discipline_id),
  available BOOLEAN
);

CREATE TABLE Discipline(
  discipline_id int NOT NULL PRIMARY KEY,
  discipline_name varchar(255)
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
  question_status BOOLEAN,
  answer_id int FOREIGN KEY REFERENCES Answer(answer_id)
);

CREATE TABLE Answer(
  answer_id int NOT NULL PRIMARY KEY,
  answer_string varchar(3000),
  question_id int FOREIGN KEY REFERENCES Question(question_id)
);

CREATE TABLE Queue(
  queue_id int NOT NULL PRIMARY KEY,
  answer_ids varchar(3000),
  question_ids varchar(3000),
  student_ids varchar(3000),
  teacher_id int FOREIGN KEY REFERENCES Teacher(teacher_id),
  discipline_name varchar(255) FOREIGN KEY REFERENCES Discipline(discipline_name),
  question_status BOOLEAN FOREIGN KEY REFERENCES Question(question_status)
);
