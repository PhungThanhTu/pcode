-- default no deadline options
-- other default option will be hardcoded into a config file in backend code
create procedure CreateExerciseInDocument
    @Id UNIQUEIDENTIFIER,
    @DocumentId UNIQUEIDENTIFIER,
    @RuntimeLimit INT,
    @MemoryLimit INT,
    @ScoreWeight INT,
    @ManualPercentage FLOAT
    AS
        INSERT INTO [dbo].[Exercise]
        (Id, RuntimeLimit, MemoryLimit, ScoreWeight, TimeCreated, ManualPercentage, HaveDeadline)
        VALUES
        (@Id, @RuntimeLimit, @MemoryLimit, @ScoreWeight, GETDATE(), @ManualPercentage, 0)
        INSERT INTO [dbo].[DocumentExercise]
        (DocumentId, ExerciseId)
        VALUES
        (@DocumentId, @Id)