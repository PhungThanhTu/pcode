create procedure DeleteContent
    @Id UNIQUEIDENTIFIER
    AS
    DELETE FROM [dbo].[ContentType]
        where Id = @Id