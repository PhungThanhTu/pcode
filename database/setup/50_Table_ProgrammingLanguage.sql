-- remove legacy table Programming Language
-- drop table ProgrammingLanguage

create table ProgrammingLanguage
(
    Id int PRIMARY KEY,
    LanguageName varchar(20),
    FileExtension varchar(10),
    DisplayName varchar(40),
    NeedCompile bit,
    CompileCommand nvarchar(max),
    RunCommand nvarchar(max)
)
insert into [dbo].[ProgrammingLanguage] 
(Id,LanguageName, DisplayName,FileExtension, NeedCompile, CompileCommand, RunCommand)
VALUES 
(1,
'c',
'C',
'c',
'1',
'./$FILENAME',
'/usr/bin/g++ -Wfatal-errors -w -o $SUBMISSION_ID $SUBMISSION_ID.$EXTENSION'),
(2,
'cpp',
'C++',
'cpp',
'1',
'/usr/bin/g++ -Wfatal-errors -w -o $SUBMISSION_ID $SUBMISSION_ID.$EXTENSION',
'./$FILENAME')