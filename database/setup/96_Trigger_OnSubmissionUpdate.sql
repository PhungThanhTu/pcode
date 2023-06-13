CREATE TRIGGER [dbo].[OnSubmissionUpdate]
ON [dbo].[Submission]
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    declare @Choice BIT
    select @Choice = Choice from inserted
    if @Choice = 1
        BEGIN
            declare @SubmissionId UNIQUEIDENTIFIER
            select @SubmissionId = Id from inserted
            declare @AutomatedScore FLOAT
            select @AutomatedScore = AutomatedScore from inserted
            declare @ManualScore FLOAT
            select @ManualScore = COALESCE(ManualScore,0) from inserted
            declare @ExerciseId UNIQUEIDENTIFIER
            select @ExerciseId = ExerciseId from inserted
            
            declare @ManualPercentage float
            select @ManualPercentage = ManualPercentage from [dbo].[Exercise]
                where Id = @ExerciseId
            declare @DocumentId UNIQUEIDENTIFIER

            declare @UserId UNIQUEIDENTIFIER
            select @UserId = UserId from [dbo].[SubmissionUser]
                where SubmissionId = @SubmissionId

            declare @Score float
            SET @Score = @ManualScore * @ManualPercentage + @AutomatedScore * (1 - @ManualPercentage)

            UPDATE [dbo].[Submission] set Score = @Score
                where Id = @SubmissionId

            select @DocumentId = DocumentId from [dbo].[DocumentExercise]
                where ExerciseId = @ExerciseId
            MERGE [dbo].[DocumentScore] as DestinationTable
            USING(
                VALUES
                (
                    @UserId,
                    @DocumentId,
                    @Score
                )
            ) as UpsertingData
            (
                UserId,
                DocumentId,
                Score
            )
            ON DestinationTable.UserId = UpsertingData.UserId
            AND DestinationTable.DocumentId = UpsertingData.DocumentId
            WHEN MATCHED THEN
                UPDATE SET
                    DestinationTable.Score = UpsertingData.Score
            WHEN NOT MATCHED THEN
                INSERT (UserId, DocumentId, Score)
                VALUES (
                UpsertingData.UserId,
                UpsertingData.DocumentId,
                UpsertingData.Score
            );

        declare @CourseId UNIQUEIDENTIFIER
        declare @MaxScore float
        declare @SumScore float
        select @CourseId = CourseId from [dbo].[DocumentCourse]
            where DocumentId = @DocumentId
 
        
        select @SumScore = sum(Score * ScoreWeight)
            from [dbo].[DocumentExercise] DE
                join [dbo].[DocumentCourse] DC
                on DE.DocumentId = DC.DocumentId
                join [dbo].[Exercise] E
                on DE.ExerciseId = E.Id
                join [dbo].[DocumentScore] DS
                on DS.DocumentId = DE.DocumentId
                WHERE DS.UserId = @UserId
                and DC.CourseId = @CourseId
                GROUP BY DC.CourseId


        select @MaxScore = 
            10*sum(ScoreWeight)
            from [dbo].[DocumentExercise] DE
                join [dbo].[DocumentCourse] DC
                on DE.DocumentId = DC.DocumentId
                join [dbo].[Exercise] E
                on DE.ExerciseId = E.Id
                Where DC.CourseId = @CourseId
                GROUP BY DC.CourseId

        declare @CourseScore float
        set @CourseScore = @SumScore * 10.0 / @MaxScore
        
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
END



        SELECT ExerciseId, DocumentId from [dbo].[DocumentExercise]
        where DocumentId = '0FD5DF65-6043-4E98-B3B9-499CA89D5368'

        select 
        10*sum(ScoreWeight)
        from [dbo].[DocumentExercise] DE
            join [dbo].[DocumentCourse] DC
            on DE.DocumentId = DC.DocumentId
            join [dbo].[Exercise] E
            on DE.ExerciseId = E.Id
            Where DC.CourseId = 'a78b7761-e99f-4854-8e6a-ceec88f0fe51'
            GROUP BY DC.CourseId

select @SumScore =
        sum(Score * ScoreWeight)
        --*
        from [dbo].[DocumentExercise] DE
            join [dbo].[DocumentCourse] DC
            on DE.DocumentId = DC.DocumentId
            join [dbo].[Exercise] E
            on DE.ExerciseId = E.Id
            join [dbo].[DocumentScore] DS
            on DS.DocumentId = DE.DocumentId
            WHERE DS.UserId = 'cea4ce1c-84e8-4145-be87-a2aeef1635b0'
            GROUP BY DC.CourseId

select * from [dbo].[PlpUser] where username = '22521188'

4,285714285713/30