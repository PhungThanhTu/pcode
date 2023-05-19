create trigger [dbo].[OnDocumentScoreUpsert]
    on [dbo].[DocumentScore]
    after insert,update, DELETE
    AS
    BEGIN
        declare @UserId UNIQUEIDENTIFIER
        declare @DocumentId UNIQUEIDENTIFIER
        declare @ExerciseId UNIQUEIDENTIFIER
        declare @CourseId UNIQUEIDENTIFIER
        declare @MaxScore int
        declare @SumScore float

        select @UserId = UserId from inserted
        select @DocumentId = DocumentId from inserted
        select @CourseId = CourseId from [dbo].[DocumentCourse]
            where DocumentId = @DocumentId
 
        
        select @SumScore = sum(Score * ScoreWeight) from [dbo].[DocumentExercise] DE
            join [dbo].[DocumentCourse] DC
            on DE.DocumentId = DC.DocumentId
            join [dbo].[Exercise] E
            on DE.ExerciseId = E.Id
            join [dbo].[DocumentScore] DS
            on DS.DocumentId = DE.DocumentId
            WHERE DE.DocumentId = @DocumentId
            AND DE.ExerciseId = @ExerciseId
            GROUP BY DC.CourseId

        select @SumScore = sum(10* ScoreWeight) from [dbo].[DocumentExercise] DE
            join [dbo].[DocumentCourse] DC
            on DE.DocumentId = DC.DocumentId
            join [dbo].[Exercise] E
            on DE.ExerciseId = E.Id
            WHERE DE.DocumentId = @DocumentId
            AND DE.ExerciseId = @ExerciseId
            GROUP BY DC.CourseId

        declare @Score float
        set @Score = @SumScore * 10 / @MaxScore
        
        MERGE [dbo].[CourseScore] as DestinationTable
            USING(
                VALUES
                (
                    @UserId,
                    @CourseId,
                    @Score
                )
            ) as UpsertingData
            (
                UserId,
                CourseId,
                Score
            )
            ON DestinationTable.UserId = UpsertingData.UserId
            AND DestinationTable.CourseId = UpsertingData.CourseId
            WHEN MATCHED THEN
                UPDATE SET
                    DestinationTable.Score = UpsertingData.Score
            WHEN NOT MATCHED THEN
                INSERT (UserId, CourseId, Score)
                VALUES (
                UpsertingData.UserId,
                UpsertingData.CourseId,
                UpsertingData.Score
                );
    END