const { getRoleOfCourseSql } = require("./models/right.model")

const test = async () => {


    const role = await getRoleOfCourseSql('06336d82-3518-4440-92e0-bdcf57a5db32','31a60d02-0370-48ce-b273-4753369eebd2');

    console.log(role);
}

test();