create procedure GetTestCasesBySubmissionId
    @SubmissionId UNIQUEIDENTIFIER
    AS
    DECLARE @ExerciseId UNIQUEIDENTIFIER
    SELECT @ExerciseId = ExerciseId FROM [dbo].[Submission]
    WHERE Id = @SubmissionId
    Select
    Id,
    ExerciseId,
    [Input],
    ExpectedOutput as [Output],
    ScoreWeight,
    Visibility,
    TestOrder
    FROM [dbo].[TestCase]
    WHERE ExerciseId = @ExerciseId
    ORDER BY TestOrder ASC



update [dbo].[Submission]
set 
SourceCode = '
#include<iostream>
using namespace std;
int sum(int a, int b){
    return a + b;
}
int main()
{
    int a,b;
    cin >> a >> b;
    cout << sum(a,b);
    return 0;
}'
where Id = 'A8513A02-7B8C-4807-82C2-F4CCD4017177'