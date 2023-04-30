create procedure MergeSampleSourceCodeByDocumentId
    @DocumentId UNIQUEIDENTIFIER,
    @ProgrammingLanguageId INT,
    @SourceCode NVARCHAR(max)
    as
        MERGE INTO [dbo].[SampleSourceCode] as Destination
        USING (
            VALUES
            (
                @DocumentId,
                @ProgrammingLanguageId,
                @SourceCode
            )
            
        ) as Source (DocumentId, programmingLanguageId, sourceCode)
        JOIN [dbo].[DocumentExercise] Joined on Joined.DocumentId = Source.DocumentId
        ON Joined.ExerciseId = Destination.exerciseId
        AND Source.programmingLanguageId = Destination.programmingLanguageId
        WHEN MATCHED THEN
            UPDATE SET Destination.SourceCode = @SourceCode
        WHEN NOT MATCHED THEN
            INSERT (exerciseId, programmingLanguageId, sourceCode)
            values (Joined.ExerciseId, programmingLanguageId, sourceCode);
