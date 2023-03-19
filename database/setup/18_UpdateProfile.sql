create procedure UpdateProfile
    @id UNIQUEIDENTIFIER,
    @fullName nvarchar(max),
    @email varchar(max),
    @avatar nvarchar(max) = NULL
    as
    update [dbo].[PlpUser]
        set email = @email,
            fullName = @fullName,
            avatar = isnull(@avatar,avatar)
        where id = @id



