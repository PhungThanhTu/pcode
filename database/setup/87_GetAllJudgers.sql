create procedure GetAllJudgers
    AS
    select
    Id,
    [FileName],
    [DisplayName]
    FROM [dbo].[CustomJudger]
