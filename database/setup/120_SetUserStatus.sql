create procedure SetUserStatus
    @UserId UNIQUEIDENTIFIER,
    @UserStatus int
    AS
        UPDATE [dbo].[PlpUser]
        set userStatus = @UserStatus
        where id = @UserId