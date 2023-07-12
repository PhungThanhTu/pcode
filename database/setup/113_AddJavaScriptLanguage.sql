
insert into [dbo].[ProgrammingLanguage] 
(Id,LanguageName, DisplayName,FileExtension, NeedCompile, CompileCommand, RunCommand)
VALUES 
(3,
'js',
'Nodejs',
'js',
'0',
'echo compile',
'/usr/bin/node $FILENAME.$EXTENSION')


insert into [dbo].[ProgrammingLanguage] 
(Id,LanguageName, DisplayName,FileExtension, NeedCompile, CompileCommand, RunCommand)
VALUES 
(4,
'python3',
'Python 3.7',
'py',
'0',
'echo compile',
'/usr/bin/python3 $FILENAME.$EXTENSION')

update [dbo].[ProgrammingLanguage]
set RunCommand = '/usr/bin/python3 $FILENAME.$EXTENSION'
where Id = 4