const oracleConfig = require('./oracleSetup')
const oracledb = require('oracledb')

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;

module.exports = async function(sqlQuery, bindingVar = null){

  let connection; 
  try {
    connection =  await oracledb.getConnection(oracleConfig())
    return await connection.execute(sqlQuery, bindingVar)

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