
------ INITIALIZE DATABASE, 

--- PROCEDURE
create procedure UpdateProfile
    @id UNIQUEIDENTIFIER,
    @fullName nvarchar(max),
    @email varchar(max),
    @avatar nvarchar(max)
    as
    update [dbo].[PlpUser]
        set email = @email,
            fullName = @fullName,
            avatar = isnull(@avatar,avatar)
        where id = @id
go

create procedure ChangePassword
    @id UNIQUEIDENTIFIER,
    @hashedPassword varchar(max)
    as
        update [dbo].[PlpUser]
            set hashedPassword = @hashedPassword
        where id = @id
go




