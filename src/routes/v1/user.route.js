const express = require('express');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/api/user.controller') 
const auth = require('../../middlewares/auth');

const router = express.Router();


router.post('/questionnaireResponses', auth(),validate(userValidation.questionnaireResponse) ,  userController.createQuestionnaireResponse);
router.post('/preferences', auth() ,validate(userValidation.createPreference) , userController.createUserPreference);
router.route('/preferences/:userId').patch(auth() ,validate(userValidation.updatePreference) , userController.updatePreferences)

router
  .route('/:userId')
  // .get(auth(permissions.readOwn, resources.users), validate(userValidation.getUser), userController.getUser)
  .patch(auth() ,validate(userValidation.updateUser), userController.updateUser)
  // .delete(auth(permissions.delete, resources.users), validate(userValidation.deleteUser), userController.deleteUser);
router.get('/all/homeScreen',auth(), userController.getAllUsers);
router.get('/checkMatch',auth(), userController.checkMatch );
router.patch('/unmatch/:userId',auth(), userController.unMatchAUser);
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users Management
 */

/**
 * @swagger
 * /users/questionnaireResponses:
 *   post:
 *     summary: Answer the questionnaire
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               educationProfession:
 *                 type: string
 *               hobbiesPassions: 
 *                 type: string   
 *               kidsPets:
 *                 type: string
 *               valuesPersonality:
 *                 type: string
 *               greenFlags:
 *                 type: string
 *               redFlags:
 *                 type: string
 *             example:
 *               educationProfession: Sample text 
 *               hobbiesPassions: Sample hobbies professions
 *               kidsPets: sample kids pets
 *               greenFlags: sample green flags
 *               redFlags: sample red flags
 *               valuesPersonality: sample relationship experiences
 * 
 * 
 *     responses:
 *       "200":
 *         $ref: '#components/responses/UserRegistered'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */

/**
 * @swagger
 * /users/{id}:
 *
 *   patch:
 *     summary: Update user personal information
 *     description: Logged in users can only update their own information. Only admins can update other users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               age:
 *                  type: integer
 *               height:
 *                  type: float
 *               weight:
 *                  type: float
 *               city:
 *                  type: string
 *               postalCode:
 *                  type: string
 *               gender:
 *                  type: integer
 *               religion:
 *                  type: integer
 *               relationshipIntention:
 *                  type: integer
 *               location:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   lat:
 *                     type: number
 *                   lng:
 *                     type: number
 *             example:
 *               firstName: update name
 *               lastName: update last name
 *               age: 22
 *               height: 24.5
 *               weight: 54.6
 *               city: Lahore
 *               postalCode: "20456"
 *               gender: 0
 *               religion: 2
 *               relationshipIntention: 2
 *               location:
 *                 name: Florida Gulf Coast University FGCU FGCU Boulevard Fort Myers FL USA
 *                 latitude: 26.4626967
 *                 longitude: -81.7800748
 *                 latitudeDelta: 0.0922
 *                 longitudeDelta: 0.0421
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/UserResponse'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /users/preferences:
 *   post:
 *     summary: Store user preferences
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               genderPreference:
 *                 type: number
 *               agePreference: 
 *                 type: number   
 *               heightPreference:
 *                 type: number
 *               bmiPreference:
 *                 type: number
 *               religionPreference:
 *                 type: number
 *               locationPreference:
 *                 type: number
 *               relationshipIntention:
 *                 type: number
 *             example:
 *               genderPreference: 2
 *               agePreference: 0
 *               heightPreference: 1
 *               bmiPreference: 0
 *               religionPreference: 1
 *               locationPreference: 1
 *               relationshipIntention: 1
 * 
 * 
 *     responses:
 *       "200":
 *         $ref: '#components/responses/UserRegistered'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */
/**
 * @swagger
 * /users/preferences/{userId}:
 *
 *   patch:
 *     summary: Update user preferences
 *     description: Logged in users can update their preferences
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User Id 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               genderPreference:
 *                 type: number
 *               agePreference: 
 *                 type: number   
 *               heightPreference:
 *                 type: number
 *               bmiPreference:
 *                 type: number
 *               religionPreference:
 *                 type: number
 *               locationPreference:
 *                 type: number
 *               relationshipIntention:
 *                 type: number
 *             example:
 *               genderPreference: 2
 *               agePreference: 0
 *               heightPreference: 1
 *               bmiPreference: 0
 *               religionPreference: 1
 *               locationPreference: 1
 *               relationshipIntention: 1
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/UserResponse'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
/**
 * @swagger
 * /users/all/homeScreen:
 *   get:
 *     summary: Get all users
 *     description: retrieve all users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of users
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/MultipleUsersResponse'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /users/checkMatch:
 *   get:
 *     summary: Get all users
 *     description: retrieve all users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: MUser id of the user with whom current user wanna match 
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/MultipleUsersResponse'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /users/unmatch/{userId}:
 *
 *   patch:
 *     summary: Update Unmatched users by this user
 *     description: Logged in users can update their Unmatched users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User Id of the user to whom current user wants to unmatch
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/UserResponse'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */