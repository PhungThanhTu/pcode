insert into [dbo].[ProgrammingLanguage] 
(Id,LanguageName, DisplayName,FileExtension, NeedCompile, CompileCommand, RunCommand)
VALUES
(3,
'lua',
'Lua 5.4.4',
'lua',
'0',
'',
'/usr/local/bin/lua ./$FILENAME.$EXTENSION')

insert into [dbo].[ProgrammingLanguage] 
(Id,LanguageName, DisplayName,FileExtension, NeedCompile, CompileCommand, RunCommand)
VALUES
(4,
'python',
'Python 3.10.11',
'py',
'0',
'',
'/usr/local/bin/python3.10 ./$FILENAME.$EXTENSION')

-- insert into [dbo].[ProgrammingLanguage] 
-- (Id,LanguageName, DisplayName,FileExtension, NeedCompile, CompileCommand, RunCommand)
-- VALUES
-- (5,
-- 'rust',
-- 'Rust 1.71.0',
-- 'rs',
-- '1',
-- '/usr/local/bin/rustc linker=/usr/bin/cc $FILENAME.$EXTENSION',
-- './$FILENAME')

-- update [dbo].[ProgrammingLanguage]
--     set CompileCommand = '/usr/local/bin/rustc -C linker=/usr/bin/cc $FILENAME.$EXTENSION'
--     where Id = 5

insert into [dbo].[ProgrammingLanguage] 
(Id,LanguageName, DisplayName,FileExtension, NeedCompile, CompileCommand, RunCommand)
values
(6,
'ruby',
'ruby 3.2.2',
'rb',
'0',
'',
'/usr/local/bin/ruby ./$FILENAME.$EXTENSION')
