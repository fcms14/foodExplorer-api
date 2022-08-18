const UserRepository = require("../respositories/UserRepository");
const UserCreateService = require("../services/UserCreateService");

class UsersController {
    async create(req, res) {
        const { name, email, password } = req.body;

        const userRepository = new UserRepository();
        const userCreateService = new UserCreateService(userRepository);

        await userCreateService.execute({ name, email, password });

        return res.status(201).json();
    }
}

module.exports = UsersController;