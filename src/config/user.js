const getStatuses = [0, 1];
const getTypes = [0, 1, 2, 3];
const intentionEnum= [0,1,2];
const religionEnum= [0,1,2,3,4];
const genderEnum= [0,1,2];
const idTypes = ['standardId', 'facebookId', 'googleId', 'appleId'];

const status = {
  pending: 0,
  active: 1,
};
const gender ={
  MALE:1 , 
  FEMALE:2,
  OTHER:3
}

const religion ={
  CHRISTIAN:0 ,
  JEW:1,
  MUSLIM:2,
  ATHEIST:3,
  OTHER:4,
}
const relIntention = {
  DATING :0 , 
  SERIOUSRELATIONSHIP:1,
  OPENRELATIONSHIP:2,
}
const types = {
  STANDARD: 0,
  FACEBOOK: 1,
  GOOGLE: 2,
  APPLE: 3,
};



module.exports = {
  getStatuses,
  getTypes,
  status,
  types,
  idTypes,
  intentionEnum,
  relIntention,
  religion,
  religionEnum,
  gender,
  genderEnum
};
