# Ticket-System-Queue-for-TAs
A Ticket system intended for students and TA's (Teaching Assistants) to communicate effectively using a queue based system.

# Project Members
- Bruce Szostak
- Dylan Ollikka
- Erwin Pascual
- Seth Thompson

# Technologies

### Front End:
 - Jade (Pug)
 - Javascript
 - jQuery
### Back End:
 - NodeJS
 - Express
 - MYSQL
### API's:
 - Google sign in
 - Zoom API
 - OAuth 2.0

<hr>

# Student Side
Students can:
* Ask professors and academic advisors questions through a queue based system
* Join the professor's office hours to ask questions
* Join a scheduled zoom meeting
* Upvote popular questions

## Login Page
* Uses OAuth 2.0
* Join a professor's office hours to ask questions which is an industry-standard for authentication services
* ID tokens are used to send the profile ID to the server securely where it is decrypted using google's nodejs plugin. 
* We can use a G-Suite such as MacEwan’s to verify student accounts securely.


![image](https://user-images.githubusercontent.com/56744638/116008104-235cd880-a5d0-11eb-99f1-d8a9ab892a87.png)

## Student Homepage
![image](https://user-images.githubusercontent.com/56744638/116008170-66b74700-a5d0-11eb-8ffe-1340b0636200.png)

## Ask a Question Page
Question asking:
* Can ask professors and academic advisors questions with ease.
* Allows tagging to keep questions organized, such as Assignment 1, Midterm 1, etc.
* An additional description can be given.

![image](https://user-images.githubusercontent.com/56744638/116008234-abdb7900-a5d0-11eb-8a9a-bb5048b751ce.png)

## Search Professors
Students can easily search for any professor via this page, and are able to check their schedule along with their answered questions and may join their current answering session.
<br>

![image](https://user-images.githubusercontent.com/56744638/116008340-4471f900-a5d1-11eb-8e16-8277431583af.png)

<hr>

# Professor Side
Professor functionality:
* Answer students' questions through text or a zoom call in a queue system
* Upvote popular questions
* Create, edit, or delete schedules

## Professor Homepage
![image](https://user-images.githubusercontent.com/56744638/116008199-88183300-a5d0-11eb-9a08-3fb7c2eef13f.png)

## Current Courses
Professors can view the courses they are currently in, and can also add courses so they can receive questions from that course or delete it to stop receiving questions

![image](https://user-images.githubusercontent.com/56744638/116008359-5e134080-a5d1-11eb-81be-e235f13cc5a2.png)

## Questions Overview
Professor question overview:
* Can see all courses that questions may be asked, and “Answer Questions” will be highlighted green if there exists unanswered questions.
* Can view already answered questions sorted by tag.
* Automatically sorted from course with the most unanswered questions to the least.

![image](https://user-images.githubusercontent.com/56744638/116008389-800cc300-a5d1-11eb-9fc2-c93a794a56f1.png)

## View Schedules
Schedule functionality:
* Students can view a professor’s up-to-date availability
* Join a scheduled office hour session through zoom

![image](https://user-images.githubusercontent.com/56744638/116008373-6d928980-a5d1-11eb-9aa5-29e85a060be6.png)
