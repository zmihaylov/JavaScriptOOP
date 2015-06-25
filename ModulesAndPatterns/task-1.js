/* Task Description */
/* 
* Create a module for a Telerik Academy course
  * The course has a title and presentations
    * Each presentation also has a title
    * There is a homework for each presentation
  * There is a set of students listed for the course
    * Each student has firstname, lastname and an ID
      * IDs must be unique integer numbers which are at least 1
  * Each student can submit a homework for each presentation in the course
  * Create method init
    * Accepts a string - course title
    * Accepts an array of strings - presentation titles
    * Throws if there is an invalid title
      * Titles do not start or end with spaces
      * Titles do not have consecutive spaces
      * Titles have at least one character
    * Throws if there are no presentations
  * Create method addStudent which lists a student for the course
    * Accepts a string in the format 'Firstname Lastname'
    * Throws if any of the names are not valid
      * Names start with an upper case letter
      * All other symbols in the name (if any) are lowercase letters
    * Generates a unique student ID and returns it
  * Create method getAllStudents that returns an array of students in the format:
    * {firstname: 'string', lastname: 'string', id: StudentID}
  * Create method submitHomework
    * Accepts studentID and homeworkID
      * homeworkID 1 is for the first presentation
      * homeworkID 2 is for the second one
      * ...
    * Throws if any of the IDs are invalid
  * Create method pushExamResults
    * Accepts an array of items in the format {StudentID: ..., Score: ...}
      * StudentIDs which are not listed get 0 points
    * Throw if there is an invalid StudentID
    * Throw if same StudentID is given more than once ( he tried to cheat (: )
    * Throw if Score is not a number
  * Create method getTopStudents which returns an array of the top 10 performing students
    * Array must be sorted from best to worst
    * If there are less than 10, return them all
    * The final score that is used to calculate the top performing students is done as follows:
      * 75% of the exam result
      * 25% the submitted homework (count of submitted homeworks / count of all homeworks) for the course
*/

function solve() {
    var Course = {
        init: function (title, presentations) {
            if (!isTitleValid(title)) {
                throw new Error('Invalid title');
            }

            if (!arePresentationsTitlesValid(presentations)) {
                throw new Error('The problem is some where in the presentations');
            }

            this.title = title;
            this.presentations = presentations;
            this.students = [];

            return this;
        },
        addStudent: function (name) {
            if (!isStudentNameValid(name)) {
                throw new Error('Student name is invalid!');
            }

            var names = name.split(' ');
            var student = {
                firstname: names[0],
                lastname: names[1],
                id: this.students.length + 1,
                numberOfHW: 0,
            };

            this.students.push(student);

            return student.id;
        },
        getAllStudents: function () {
            return this.students.slice(0);
        },
        submitHomework: function (studentID, homeworkID) {
            if (!isIdValid(studentID, this.students) || !isIdValid(homeworkID, this.presentations)) {
                throw new Error('Invalid id');
            }

            this.students[studentID - 1].numberOfHW++;
        },
        pushExamResults: function (results) {
            var students = this.students;
            results.forEach(function (currentStudent) {
                if (!isIdValid(currentStudent.StudentID, students)) {
                    throw new Error('Inavlid id');
                }

                if (isNaN(currentStudent.Score)) {
                    throw new Error('Score is nan');
                }

                if (!students[currentStudent.StudentID - 1].hasOwnProperty('score')) {
                    students[currentStudent.StudentID - 1].score = currentStudent.Score;
                }
                else {
                    throw new Error('Can take exam two times');
                }
            });
        },
        getTopStudents: function () {
            var topStudent = [];
            var presentations = this.presentations;

            this.students.forEach(function (student) {
                student.finalScore = (0.75 * student.score) + (0.25 * (student.numberOfHW / presentations.length));
            });

            this.students.sort(function (first, second) {
                return second.finalScore - first.finalScore;
            });

            topStudent = this.students.slice(0, 10);

            return topStudent;
        }
    };

    function isIdValid(id, arr) {
        if (isNaN(id) || id < 1 || id > arr.length) {
            return false;
        }
        return true;
    }

    function isStudentNameValid(name) {

        if (typeof name !== 'string') {
            return false;
        }

        var names = name.split(' ');

        if (names.length !== 2) {
            return false;
        }

        if (names.some(function (currName) {
            if (currName.length > 1) {
                return !(/[A-Z]/.test(currName[0]) && /^[a-z]/.test(currName.substring(1)));
        }
        else {
                return !(/[A-Z]/.test(currName));
        }
        })) {
            return false;
        }

        return true;
    }

    function isTitleValid(title) {
        if (title.length < 1 || title.trim() !== title || title.match(/\s\s/)) {
            return false;
        }

        return true;
    }

    function arePresentationsTitlesValid(presentations) {
        if (presentations === undefined || !presentations.length || presentations.some(function (title) {
            return !isTitleValid(title);
        })) {
            return false;
        }

        return true;
    }

    return Course;
}

//var test = solve();
//test.init('telerik', ['oop', 'javascript', 'csharp']);
//test.addStudent('Zlatimir Mihaylov');
//test.addStudent('Jores Jorov');
//test.submitHomework(1, 1);
//test.submitHomework(2, 1);
//test.submitHomework(2, 2);
//test.pushExamResults([{ StudentID: 1, Score: 75 }, { StudentID: 2, Score: 100 }]);
//console.log(test.getAllStudents());
//console.log(test.getTopStudents());
module.exports = solve;
