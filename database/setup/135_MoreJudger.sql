insert into [dbo].[CustomJudger]
(
    Id,
    DisplayName,
    [FileName]
)
VALUES
(
    '0de83392-add1-4c12-8e90-633a16ee0956',
    'Trimmed String Comparing',
    'trimmedstring'
)

select * from [dbo].[CustomJudger]

delete from [dbo].[CustomJudger] where Id = '0de83392-add1-4c12-8e90-633a16ee0956'