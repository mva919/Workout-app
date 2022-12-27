import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  // find the absolute path of the json dir
  const jsonDir = path.join(process.cwd(), 'json');
  // read the json data file data.json
  const fileContent = await fs.readFile(jsonDir + '/data.json', 'utf-8');
  // return the content of the data file in json format
  res.status(200).json(fileContent);
}