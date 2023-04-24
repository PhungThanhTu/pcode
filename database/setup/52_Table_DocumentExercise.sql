create table DocumentExercise
    (
        DocumentId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Document](Id),
        ExerciseId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Exercise](Id),
        CONSTRAINT PK_DocumentCourse PRIMARY KEY (DocumentId, ExerciseId)
    )