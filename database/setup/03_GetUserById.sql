-- created
create procedure GetUserById
    @id UNIQUEIDENTIFIER
    AS
        select id,username,hashedPassword,email,fullName,refreshToken,expiryDate,avatar
        from [dbo].[PlpUser]
        where id= @id