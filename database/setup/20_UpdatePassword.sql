create procedure UpdatePassword
    @id UNIQUEIDENTIFIER,
    @hashedPassword NVARCHAR(max)
    AS
        update [dbo].[PlpUser]
            set hashedPassword = @hashedPassword
            where id = @id