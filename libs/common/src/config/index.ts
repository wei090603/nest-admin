/*
 * @Description: 
 * @Author: tao.wei
 * @Date: 2021-11-10 22:55:06
 */
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';


const env = process.env.NODE_ENV || 'development'

const configFileNameObj = {
  development :'development.yml',
  production: 'production.yml'
}

export default () => {
  return yaml.load(readFileSync(join(process.cwd(), `./${configFileNameObj[env]}`), 'utf-8')) as Record<string, any>
}
