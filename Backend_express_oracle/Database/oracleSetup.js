const oracledb = require('oracledb')

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;

const mypw = '123'  // set mypw to the hr schema password

module.exports = async function(sqlQuery, bindingVar = null) {

  let connection;

  try {
    connection = await oracledb.getConnection({
      user          : "BUET",
      password      : mypw,
      connectString : "localhost/ORCL"
    })
    return await connection.execute(sqlQuery, bindingVar)

    /*const bindvars = {
      Std_Id : 2,
      Std_Name: 'pqrs',
      Address: 'Dhaka'
    }*/
    //const result = await connection.execute(
     // `INSERT INTO Student VALUES (:Std_Id, :Std_Name, :Address)`,
      //bindvars,
      //{ autoCommit: true }
      //`SELECT manager_id, department_id, department_name
       //FROM departments`
       //WHERE manager_id = :id`,
      //[103],  // bind value for :id
    //);

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

//run();