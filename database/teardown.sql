-- cleanup procedures
drop procedure RegisterPlpUser
drop procedure UpdateRefreshToken
drop procedure GetUserByUsername
drop procedure UpdateUser
drop procedure UpdatePassword
drop procedure UpdateAvatar
drop procedure GetUserById
drop procedure GetTestCasesBySubmissionId
drop procedure UpdateSubmissionResult
drop procedure GrantUserRoleToCourse
drop procedure CreateCourse


-- cleanup db
drop table PlpCourseAuthorization
drop table SubmissionTestResult
drop table SubmissionSourceCode
drop table Submission
drop table RunStatus
drop table MetaTestCase
drop table SampleSourceCode
drop table ProgrammingLanguage
drop table Exercise
drop table course 
go