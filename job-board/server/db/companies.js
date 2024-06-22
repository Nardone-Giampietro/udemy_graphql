import DataLoader from "dataloader";
import { connection } from './connection.js';

const getCompanyTable = () => connection.table('company');

export async function getCompany(id) {
  return await getCompanyTable().first().where({ id });
}

export function createCompanyLoader(){
  return new DataLoader(async (Ids) =>{
    const companies = await getCompanyTable().select().whereIn("id", Ids);
    return Ids.map((id) => companies.find((c) => c.id === id));}
  )}