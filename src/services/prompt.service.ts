import inquirer from 'inquirer'


class PromptService {

    // create a list prompt 
    public static list(message: String, answerKey: String, choices: Array<String>) {
        return inquirer.prompt([
            {
                message: message,
                name: answerKey,
                type: "list",
                choices
            }
        ])
    }

    // create a list prompt 
    public static confirm(message: String, answerKey: String) {
        return inquirer.prompt([
            {
                name: answerKey,
                message: message,
                type: "confirm"
            }
        ])
    }
    // create an input prompt 
    public static input(message: String, answerKey: String) {
        return inquirer.prompt([
            {
                message: message,
                name: answerKey,
                type: "input"
            }
        ])
    }

    // create an password prompt 
    public static password(message: String, answerKey: String) {
        return inquirer.prompt([
            {
                message: message,
                name: answerKey,
                type: "password"
            }
        ])
    }

}


export default PromptService