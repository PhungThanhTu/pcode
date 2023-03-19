-- created
create procedure UpdateRefreshToken
    @id UNIQUEIDENTIFIER,
    @refreshToken varchar(max),
    @expiryDate DATETIME
    AS
    BEGIN
        update PlpUser
            set refreshToken = @refreshToken,
                expiryDate = @expiryDate
            where id = @id
            
    END