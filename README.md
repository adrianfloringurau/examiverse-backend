# examiverse-backend
TODO LIST:
1. Create the necessary tables in the DB: Users; Students; Teachers; Exams; Questions; Answers.
2. Add 'Create student account' and 'Create teacher account' functionalities.
3. Hash the password stored in the DB.
4. Create specific functionalities for both students and teachers. I.e.: A student can view all exams, but can only access and attend one using a text code or a QR code; A teacher can only see the exams they've created and have access to exam creation, editing and monitoring functionalities. Only an admin can see everything and has unlimited access.
   4.1. Real time exam status (PENDING, OPEN or CLOSED)
   4.2. QR generation
   4.3. Single-choice and multiple-choice questions
   4.4. Grade on-finish
   4.5. Writing questions and answers for each of them
   4.6. Assigning an amount of points per each question
   4.7. Choosing between 'SINGULAR' and 'OVERALL' as method for grade calculation
   4.8. Ability to only edit those exams with status CLOSED
   4.9. Ability to see the list of students attending the exam and downloading this list when the exam status is CLOSED
