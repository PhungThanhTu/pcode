
create procedure GetTestCasesBySubmissionId 
    @Id UNIQUEIDENTIFIER
    AS
        select m.id as testId, m.input, m.expectedOutput, m.scoreWeight from [dbo].[MetaTestCase] m join [dbo].[Exercise] e on m.exercise = e.id
        join [dbo].[Submission] s on s.exerciseId = e.id
        where s.id = @Id