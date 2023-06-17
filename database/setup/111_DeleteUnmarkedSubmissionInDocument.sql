create procedure DeleteUnmarkedSubmissionInDocument
    @DocumentId UNIQUEIDENTIFIER
    AS
        DECLARE @DeletingSubmissionId table 
        (
            Id UNIQUEIDENTIFIER
        )
        
        DECLARE @ExerciseId UNIQUEIDENTIFIER

        Select @ExerciseId = ExerciseId from [dbo].[DocumentExercise]
            where DocumentId = @DocumentId
        
        INSERT INTO @DeletingSubmissionId
            SELECT Id FROM [dbo].[Submission]
                where ExerciseId = @ExerciseId
                and Choice = 0
        
        DELETE [dbo].[TestResult] FROM [dbo].[TestResult] TR
            JOIN @DeletingSubmissionId T
                on T.Id = TR.SubmissionId
        
        DELETE [dbo].[SubmissionUser] FROM [dbo].[SubmissionUser] SU
            JOIN @DeletingSubmissionId T
                on T.Id = SU.SubmissionId

        DELETE [dbo].[Submission] FROM [dbo].[Submission] S
            JOIN @DeletingSubmissionId T
                on T.Id = S.Id