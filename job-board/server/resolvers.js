import { getJobs, getJob, getJobsByCompany } from "./db/jobs.js";
import { getCompany } from "./db/companies.js";

export const resolvers = {
    Query: {
        jobs: async () => {
            return await getJobs();
        },
        job: async (_root, { id }) => getJob(id),
        company: async (_root, { id }) => getCompany(id),
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