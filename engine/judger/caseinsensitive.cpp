// program named mainreturn.cpp
#include <iostream>
#include<string>
#include <fstream>
#include <algorithm>
#include <cstring>
#include <cctype>

using namespace std;
 
bool compareChar(char & c1, char & c2)
{
    if (c1 == c2)
        return true;
    else if (std::toupper(c1) == std::toupper(c2))
        return true;
    return false;
}
/*
 * Case Insensitive String Comparision
 */
bool caseInSensStringCompare(std::string & str1, std::string &str2)
{
    return ( (str1.size() == str2.size() ) &&
             std::equal(str1.begin(), str1.end(), str2.begin(), &compareChar) );
}

//    defining main with arguments
int main(int argc, char** argv)
{
    
    string expectedFileName = argv[1];
    string actualFileName = argv[2];
    
    ifstream file(expectedFileName);
    string expected;

    if(file.is_open())
    {
        string line;
        while(getline(file, line)){
            expected += line + '\n';
        }
        file.close();
    }
    else
    {
        cerr << "Unable to open file" << expectedFileName << std::endl;
    }

    ifstream afile(actualFileName);
    string actual;
    if(afile.is_open())
    {
        string line;
        while(getline(afile, line)){
            actual += line + '\n';
        }
        afile.close();
    }
    else
    {
        cerr << "Unable to open file" << actualFileName << std::endl;
    }

    cout << "expected :" << expected << "actual :" << actual;

    if(caseInSensStringCompare(expected, actual))
    {
        cout << "Success";
        return 0;
    }
    cerr << "Expected :" << expected << "Actual :" << actual;
    return 1;
}