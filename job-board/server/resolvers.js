import {getJobs, getJob, getJobsByCompany, createJob, deleteJob, updateJob} from "./db/jobs.js";
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
    Mutation: {
        createJob: async (_root, { input }) => {
            const job = await createJob({
                companyId: "FjcJCHJALA4i", // TODO set based on user
                title: input.title,
                description: input.description,
            });
            return job;
        },
        deleteJob: async (_root, { input: {id} }) => {
            const job = await deleteJob(id);
            return job;
        },
        updateJob: async (_root, { input: {id, title, description} }) => {
            const job = await updateJob({id, title, description});
            return job;
        }
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