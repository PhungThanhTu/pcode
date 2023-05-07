create procedure GetProgrammingLanguageById
    @Id INT
    as
    SELECT
    Id,
    LanguageName,
    FileExtension,
    DisplayName,
    NeedCompile,
    CompileCommand,
    RunCommand
    FROM [dbo].[ProgrammingLanguage]
    WHERE Id = @Id