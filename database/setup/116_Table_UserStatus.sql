create table UserStatus
(
   Id INT PRIMARY KEY,
   StatusName NVarchar(50)
)

insert into [dbo].[UserStatus]
(
    Id,
    StatusName
)
VALUES
(-1, 'Banned'),
(0, 'Normal')
