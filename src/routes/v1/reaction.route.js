const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const reactionController = require('../../controllers/api/reaction.controller');
const auth = require('../../middlewares/auth');
const router = express.Router();

router.post('/create', auth(), reactionController.createUserReaction);


/**
 * @swagger
 * /reactions/create:
 *   post:
 *     summary: Create as Reaction
 *     tags: [Reactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reactedBy:
 *                  type: string
 *               reactedTo:
 *                  type: string
 *               type:
 *                  type: integer
 *                  description: 0 FOR LIKE , 1 FOR UNLIKE
 *             example:
 *               reactedBy: 6649f7eddc3353823a63877e
 *               reactedTo: 6640d61d9dfbb412b2733489
 *               type: 1
 * 
 *     responses:
 *       "200":
 *         $ref: '#components/responses/UserRegistered'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */



module.exports = router;