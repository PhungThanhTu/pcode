
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




---- END INITIALIZE DATABASE
declare @email varchar(max) = 'updated2@gmail.com'
declare @fullName nvarchar(max) = 'Temp2 Updated Name'
declare @id UNIQUEIDENTIFIER = '8b3a539e-07bc-4fe0-8ef1-fba27841ed35'
exec UpdateProfile @id,@fullName,@email
go