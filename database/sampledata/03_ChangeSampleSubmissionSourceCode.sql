-- update the source code to whatever you want to test
update [dbo].[SubmissionSourceCode] set sourceCode = N'#include<iostream>

int SumOfTwoIntergers(int a, int b) {
  return a + b;
}

int main(){
    int a,b;
    std::cin >> a >> b;
    std::cout << SumOfTwoIntergers(a,b);
    return 0;
}'
where submissionId = '40a50118-e207-4672-9a44-7bf0aa51be76'