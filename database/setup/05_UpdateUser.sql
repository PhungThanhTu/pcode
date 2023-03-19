create procedure UpdateUser
    @id UNIQUEIDENTIFIER,
    @fullName nvarchar(max),
    @email nvarchar(max)
    as
        update [dbo].[PlpUser]
            set fullName = @fullName,
                email = @email
            where id = @id