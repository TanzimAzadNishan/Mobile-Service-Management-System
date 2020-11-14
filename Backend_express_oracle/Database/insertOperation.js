//const connectToOracle = require('./oracleSetup')
const oracleConfig = require('./oracleSetup')
const oracledb = require('oracledb')

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;

module.exports = async function(res, message, sqlQuery, bindingVar = null){
    /*connectToOracle()
    .then(async (connection)=>{
        await connection.execute(sqlQuery, bindingVar)
        .catch((err)=>{
            //console.log(err)
            return err
        })
    })*/

    let connection; 
    try {
      connection =  await oracledb.getConnection(oracleConfig())
      let result = await connection.execute(sqlQuery, bindingVar)
      let record = Promise.all([result])

      if(record != null && record[0] != null){
        console.log('record is... ', record[0])
        return false
      }
  
    } catch (err) {
      console.error(err);
      console.log(message.errorMsg)
      return true

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