CREATE PROCEDURE GetUserStatus
    @UserId UNIQUEIDENTIFIER
    as
        SELECT userStatus from [dbo].[PlpUser]
        where id = @UserId