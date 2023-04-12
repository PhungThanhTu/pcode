create procedure DeleteMedia
    @Id UNIQUEIDENTIFIER
    AS
        delete from [dbo].[MediaStorage]
            WHERE Id = @Id