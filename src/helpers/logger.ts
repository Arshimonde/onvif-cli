import chalk from "chalk";
import ora from 'ora'


export const logJSON = (object:any)=>{
 console.log(JSON.stringify(object, null, " "))
}

export const logError = (error: unknown) => {
    if (error instanceof Error) {
        console.log(chalk.red(error.message))
        return;
    } 
    console.log(chalk.red(String(error)))
}

export const logTable = (object: Object)=>{
    console.table(object);
}

export const logSuccess = (message: String) => {
    console.log(chalk.green(message))
}

export const logLoading = (message: string = "")=>{
    const spinner = ora(message+"\n").start();
    return spinner;
}
