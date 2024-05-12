
const getTypes = [0, 1, 2, 3];
const intentionEnum= [0,1,2];
const religionEnum= [0,1,2,3,4];
const genderEnum= [0,1,2];
const idTypes = ['standardId', 'facebookId', 'googleId', 'appleId'];
const ageEnum =[0, 1, 2, 3];
const heightEnum =[0, 1, 2, 3];
const bmiEnum =[0, 1, 2, 3];
const locationEnum =[0, 1, 2, 3];

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
const age ={
  ANY:0,
  OLDER:1,
  YOUNGER:2,
  SIMILAR_AGE:3
}
const height ={
  ANY: 0,
  TALLER: 1,
  SHORTER: 2,
  SIMILAR_HEIGHT:3
}
const bmi ={
  ANY: 0,
  HEAVIER: 1,
  THINNER: 2,
  SIMILAR_BMI:3
}
const location ={
  WORLD: 0,
  SAME_CITY:1,
  SAME_REGION: 2,
  SAME_COUNTRY: 3
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
  bmi,
  location,
  ageEnum,
  heightEnum,
  bmiEnum,
  locationEnum
};
