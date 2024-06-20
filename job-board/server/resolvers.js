import {getJobs, getJob, getJobsByCompany, createJob, deleteJob, updateJob} from "./db/jobs.js";
import { getCompany } from "./db/companies.js";
import {GraphQLError} from 'graphql';
import {getUser} from "./db/users.js";

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
        createJob: async (_root, { input }, {user}) => {
            if (!user){noValidToken();}
            const job = await createJob({
                companyId: user.companyId,
                title: input.title,
                description: input.description,
            });
            return job;
        },
        deleteJob: async (_root, { input: {id} }, {user}) => {
            if (!user){noValidToken();}
            const job = await deleteJob(id, user.companyId);
            if (!job){notFound("Job not found");}
            return job;
        },
        updateJob: async (_root, { input: {id, title, description} }, {user}) => {
            if (!user){noValidToken();}
            const job = await updateJob({id, title, description, companyId: user.companyId});
            if (!job){notFound("Job not found");}
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

function notFound(message){
    throw new GraphQLError(message, {
        extensions: {
            code: "NOT_FOUND",
        }
    });
}

function noValidToken(){
    throw new GraphQLError('No valid token provided', {
        extensions: {
            code: "NOT_AUTHORIZED",
        }
    });
}

function toLocaleDate (value) {
    const date = new Date(value);
    return date.toLocaleDateString();
}