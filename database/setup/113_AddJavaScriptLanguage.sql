
insert into [dbo].[ProgrammingLanguage] 
(Id,LanguageName, DisplayName,FileExtension, NeedCompile, CompileCommand, RunCommand)
VALUES 
(3,
'javascript',
'Nodejs',
'js',
'0',
'echo compile',
'/usr/bin/node $FILENAME.$EXTENSION')


insert into [dbo].[ProgrammingLanguage] 
(Id,LanguageName, DisplayName,FileExtension, NeedCompile, CompileCommand, RunCommand)
VALUES 
(4,
'python',
'Python 3.7',
'py',
'0',
'echo compile',
'/usr/bin/python3 $FILENAME.$EXTENSION')


insert into [dbo].[ProgrammingLanguage] 
(Id,LanguageName, DisplayName,FileExtension, NeedCompile, CompileCommand, RunCommand)
VALUES 
(5,
'lua',
'Lua 5.3',
'lua',
'0',
'echo compile',
'/usr/bin/lua5.3 $FILENAME.$EXTENSION')