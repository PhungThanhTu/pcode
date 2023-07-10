CREATE PROCEDURE DisableAdmin
    @UserId UNIQUEIDENTIFIER
    as
        DELETE FROM [dbo].[PlpAdminAuthorization]
        WHERE
            UserId = @UserId