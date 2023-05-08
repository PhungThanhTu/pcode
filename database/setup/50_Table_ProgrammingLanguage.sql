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
'/usr/bin/g++ -Wfatal-errors -o $FILENAME $FILENAME.$EXTENSION',
'./$FILENAME'),
(2,
'cpp',
'C++',
'cpp',
'1',
'/usr/bin/g++ -Wfatal-errors -o $FILENAME $FILENAME.$EXTENSION',
'./$FILENAME')