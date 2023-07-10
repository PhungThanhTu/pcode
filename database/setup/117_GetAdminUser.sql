CREATE PROCEDURE GetAdminUser
    @UserId UNIQUEIDENTIFIER
    as
    Select UserId from [dbo].[PlpAdminAuthorization]
    where UserId = @UserId
