var UserModel = require('../models/userModel.js');

const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

    /**
     * userController.list()
     */
    list: function (req, res) {
        UserModel.find(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            return res.json(users);
        });
    },

    /**
     * userController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            return res.json(user);
        });
    },

    /**
     * userController.create() -> Registrasi User
     */
    registrasi: async function (req, res) {
        try {
            const password = passwordHash.generate(req.body.password);
            
            var user = new UserModel({
                nama : req.body.nama,
                email : req.body.email,
                password : password,
                username : req.body.username,
                telepon : req.body.telepon,
                role  : 0 // 0 untuk viewer, 1 untuk owner
            });
    
            var userCheck = await UserModel.findOne({ email: req.body.email });
            if (userCheck) {
                return res.status(403).json({
                    message: 'Email already in use'
                });
            }
            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when creating user',
                        error: err
                    });
                }
    
                return res.status(201).json(user);
            });
        } catch (error) {
            res.status(400).json({
                error: error.message
            })
        } 
    },

    /**
     * userController.login -> Login user dengan email dan password
     */
    login: function (req, res) {
        const email = req.body.email;
        const password = req.body.password;

        UserModel.findOne({ email: email }, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            const verify = passwordHash.verify(password, user.password);

            if(verify == true)
            {
                const userToken = {
                    id: user._id,
                    email: user.email,
                    username: user.username
                }

                const token = jwt.sign({ userToken }, process.env.TOKEN_SECRET, {
                    expiresIn: '1h'
                })

                return res.status(200).send({
                    token: token
                })
            } else {
                return res.status(422).send({
                    status: 422,
                    message: "Invalid passsword/email"
                })
            }
        })
    },

    /**
     * userController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            user.id = req.body.id ? req.body.id : user.id;
			user.nama = req.body.nama ? req.body.nama : user.nama;
			user.email = req.body.email ? req.body.email : user.email;
			user.password = req.body.password ? req.body.password : user.password;
			user.role  = req.body.role  ? req.body.role  : user.role ;
			
            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }

                return res.json(user);
            });
        });
    },

    /**
     * userController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        UserModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
