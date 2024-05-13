const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const userController = require('../../controllers/api/user.controller') 
const auth = require('../../middlewares/auth');

const router = express.Router();


router.post('/questionnaireResponses', auth(), userController.createQuestionnaireResponse);
router.post('/preferences', auth(), userController.createUserPreference);

router
  .route('/:userId')
  // .get(auth(permissions.readOwn, resources.users), validate(userValidation.getUser), userController.getUser)
  .patch(auth(), userController.updateUser)
  // .delete(auth(permissions.delete, resources.users), validate(userValidation.deleteUser), userController.deleteUser);

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
 *             example:
 *               firstName: update name
 *               lastName: update last name
 *               age: 22
 *               height: 24.5
 *               weight: 54.6
 *               city: Lahore
 *               postalCode: 20456
 *               gender: 0
 *               religion: 2
 *               relationshipIntention: 2
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