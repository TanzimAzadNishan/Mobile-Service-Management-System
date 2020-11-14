
const mypw = '1234'  // set mypw to the hr schema password

module.exports = function(){

  let dbConfig = {
    user          : "PROJECT",
    password      : mypw,
    connectString : "localhost/ORCL"
  }
  return dbConfig

}
