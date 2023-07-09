CREATE PROCEDURE GetAllUsers
as
    select id,username, fullName, userStatus from [dbo].[PlpUser]
exec GetAllUsers
