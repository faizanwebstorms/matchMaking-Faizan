
const getTypes = [0, 1, 2, 3];
const intentionEnum= [0,1,2,3];
const religionEnum= [0,1,2,3,4];
const religionPreferecneEnum= [0,1];
const genderEnum= [0,1,2];
const genderPreferenceEnum= [0,1,2];
const idTypes = ['standardId', 'facebookId', 'googleId', 'appleId'];
const ageEnum =[0, 1, 2, 3];
const heightEnum =[0, 1, 2, 3];
const bodyTypeEnum =[0, 1, 2, 3];
const bodyTypePreferenceEnum =[0, 1, 2, 3];
const locationEnum =[0, 1, 2, 3];

const gender ={
  OTHER:0,
  MALE:1 , 
  FEMALE:2,
}
const genderPreference ={
  IDONTCARE:0 ,
  MALE:1 , 
  FEMALE:2,
}
const religion ={
  CHRISTIAN:0 ,
  JEW:1,
  MUSLIM:2,
  ATHEIST:3,
  OTHER:4,
}
const religionPreference ={
  IDONTCARE:0 ,
  SAMEASME:1
}
const relIntention = {
  IDONTCARE:0,
  DATING :1 , 
  SERIOUSRELATIONSHIP:2,
  OPENRELATIONSHIP:3,
}
const types = {
  STANDARD: 0,
  FACEBOOK: 1,
  GOOGLE: 2,
  APPLE: 3,
};
const age ={
  IDONTCARE:0,
  SIMILAR:1,
  OLDER:2,
  YOUNGER:3,
}
const height ={
  IDONTCARE: 0,
  SIMILAR:1,
  TALLER: 2,
  SHORTER: 3,
}
const bodyType ={
  UNDERWEIGHT: 0,
  OVERWEIGHT:1,
  NORMALWEIGHT: 2,
  OBESE: 3,
}
const bodyTypePreference ={
  IDONTCARE: 0,
  SIMILAR:1,
  LARGER: 2,
  SMALLER: 3,
}
const location ={
  IDONTCARE: 0,
  SAME_COUNTRY: 1,
  SAME_REGION: 2,
  SAME_CITY:3,
}
module.exports = {
  getTypes,
  types,
  idTypes,
  intentionEnum,
  relIntention,
  religion,
  religionEnum,
  gender,
  genderEnum,
  age,
  height,
  bodyType,
  location,
  ageEnum,
  heightEnum,
  bodyTypeEnum,
  locationEnum,
  religionPreference,
  religionPreferecneEnum,
  genderPreferenceEnum,
  genderPreference,
  bodyTypePreference,
  bodyTypePreferenceEnum
};
