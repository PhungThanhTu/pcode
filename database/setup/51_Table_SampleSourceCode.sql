-- remove legacy table SampleSourceCode
-- drop table SampleSourceCode

create table SampleSourceCode
(
    exerciseId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Exercise](id) NOT NULL,
    programmingLanguageId int FOREIGN KEY REFERENCES [dbo].[ProgrammingLanguage](id) NOT NULL,
    sourceCode nvarchar(max),
    CONSTRAINT PK_SampleSourceCode PRIMARY KEY (exerciseId,programmingLanguageId)
)