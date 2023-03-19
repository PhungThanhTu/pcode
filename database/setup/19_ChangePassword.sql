create procedure ChangePassword
    @id UNIQUEIDENTIFIER,
    @hashedPassword varchar(max)
    as
        update [dbo].[PlpUser]
            set hashedPassword = @hashedPassword
        where id = @id