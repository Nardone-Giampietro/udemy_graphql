import { getJobs, getJob, getJobsByCompany } from "./db/jobs.js";
import { getCompany } from "./db/companies.js";
import {GraphQLError} from 'graphql';

export const resolvers = {
    Query: {
        jobs: async () => {
            return await getJobs();
        },
        job: async (_root, { id }) => {
           const job = await getJob(id);
           if (!job) {
               throw new GraphQLError(`Job not found with id: ${id}`, {
                   extensions: {
                       code: "NOT_FOUND",
                       argumentName: "job",
                   }
               });
           }
           return job;
        },
        company: async (_root, { id }) => {
            const company = await getCompany(id);
            if (!company){
                throw new GraphQLError('Company not found with id: ' + id, {
                    extensions: {
                        code: "NOT_FOUND",
                        argumentName: "id",
                    }
                });
            }
            return company;
        },
    },
    Job: {
        date: (job) => toLocaleDate(job.createdAt),
        company: (job) => getCompany(job.companyId),
    },
    Company: {
        jobs: (company) => getJobsByCompany(company.id)
    }

}

function toLocaleDate (value) {
    const date = new Date(value);
    return date.toLocaleDateString();
}