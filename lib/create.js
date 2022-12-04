import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import Inquirer from "inquirer";
import ora from "ora";

const cwd = process.cwd();

class Creator {
  constructor(projectName, options) {
    this.projectName = projectName;
    this.options = options;
    this.create();
  }
  async create() {
    const isOverWrite = await this.isExitSameDic()
    if (!isOverWrite) return;
    await this.getCollectRepo()
  }
  // 是否存在相同目录
  async isExitSameDic() {
    const targetDirection = path.join(cwd, this.projectName);
    if (fs.existsSync(targetDirection)) {
      if (this.options.force) {
        await fs.remove(targetDirection);
      } else {
        const { isOverWrite } = await new Inquirer.prompt([
          {
            name: 'isOverWrite',
            type: 'list',
            message: '是否强制覆盖已存在的同名目录？',
            choices: [
              {
                name: '覆盖',
                value: true
              },
              {
                name: '不覆盖',
                value: false
              }
            ]
          }
        ])
        if (isOverWrite) {
          await fs.remove(targetDirection);
        } else {
          console.log(chalk.red.bold('存在相同目录'));
          return false;
        }
      }
    }
    return true;
  }
  async getCollectRepo() {
    const sleep = async time => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([
            {
              name: 'vue2-template',
              value: 2
            },
            {
              name: 'vue3-template',
              value: 3
            }
          ])
        }, time)
      })
    }
    const loading = ora('正在获取模版信息...');
    loading.start();
    const list = await sleep(1000);
    console.log('list: ', list);
    loading.succeed();
    let { choiceTemplateName } = await new Inquirer.prompt([
      {
        name: 'choiceTemplateName',
        type: 'list',
        message: '请选择模版',
        choices: list
      }
    ]);
    console.log('选择了模版：' + choiceTemplateName);
  }
}
export default function (projectName, options) {
  new Creator(projectName, options);
}