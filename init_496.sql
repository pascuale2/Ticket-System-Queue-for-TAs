CREATE TABLE Teacher(
  teacher_id int NOT NULL PRIMARY KEY,
  name varchar(255),
  discipline_id int FOREIGN KEY REFERENCES Discipline(discipline_id),
  BOOLEAN available);

CREATE TABLE Discipline(
  discipline_id int NOT NULL PRIMARY KEY,
  discipline name varchar(255));

CREATE TABLE Student(
  student_id int NOT NULL PRIMARY KEY,
  name varchar(255),
  biography varchar(255),
  discipline_id int FOREIGN KEY REFERENCES Discipline(discipline_id)
);

CREATE TABLE Question(
  question_id int NOT NULL PRIMARY KEY,
  question_string varchar(255),
  answer_id int FOREIGN KEY REFERENCES Answer(answer_id)
);

CREATE TABLE Answer(
  answer_id int NOT NULL PRIMARY KEY,
  answer_string varchar(255),
  question_id int FOREIGN KEY REFERENCES Question(question_id)
);
