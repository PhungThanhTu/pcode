
------ INITIALIZE DATABASE, 

--- PROCEDURE
create procedure UpdateProfile
    @id UNIQUEIDENTIFIER,
    @fullName nvarchar(max),
    @email varchar(max)
    as
    update [dbo].[PlpUser]
        set email = @email,
            fullName = @fullName
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




