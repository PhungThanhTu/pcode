create procedure GetJudgerById
    @Id UNIQUEIDENTIFIER
    as
    select
    Id,
    [FileName],
    [DisplayName]
    FROM [dbo].[CustomJudger]
    Where Id = @Id
