create procedure GetProgrammingLanguages
    as
        select 
            Id,
            LanguageName,
            FileExtension,
            DisplayName,
            NeedCompile,
            CompileCommand,
            RunCommand
        from [dbo].[ProgrammingLanguage]