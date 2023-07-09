CREATE PROCEDURE EnableAdmin
    @UserId UNIQUEIDENTIFIER
    as
        INSERT INTO [dbo].[PlpAdminAuthorization]
        (
            UserId
        )
        VALUES
        (
            @UserId
        )