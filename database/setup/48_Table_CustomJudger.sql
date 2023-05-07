create table CustomJudger
(
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    DisplayName NVARCHAR(max),
    [FileName] NVARCHAR(max)
)

insert into [dbo].[CustomJudger]
(
    Id,
    DisplayName,
    [FileName]
)
VALUES
(
    'c4b424e3-7c17-417e-96d8-890b3f4a26f1',
    'Exact String Comparing',
    'exactstring'
)
