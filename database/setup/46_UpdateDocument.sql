create procedure UpdateDocument
    @Id UNIQUEIDENTIFIER,
    @Title nvarchar(320),
    @DocumentDescription nvarchar(640)
    AS
        UPDATE [dbo].[Document]
        SET 
            Title = @Title,
            DocumentDescription = @DocumentDescription
        WHERE
            Id = @Id
