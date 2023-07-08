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

        declare @CourseScore float

        select 
            @CourseScore = 10*Sum(Score*ScoreWeight)/Sum(10*ScoreWeight)
        from [dbo].[DocumentScore] 
            join Document on Document.Id = DocumentScore.DocumentId
            join DocumentExercise on Document.Id = DocumentExercise.DocumentId
            join Exercise on DocumentExercise.ExerciseId = Exercise.Id
            join DocumentCourse on DocumentCourse.DocumentId = Document.Id
        where CourseId = @CourseId
            and UserId = @UserId
        
        MERGE [dbo].[CourseScore] as DestinationTable
            USING(
                VALUES
                (
                    @UserId,
                    @CourseId,
                    @CourseScore
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