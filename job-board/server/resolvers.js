import { getJobs } from "./db/jobs.js";
import { getCompany } from "./db/companies.js";

export const resolvers = {
    Query: {
        jobs: async () => {
            return await getJobs();
        }
    },
    Job: {
        date: (job) => toLocaleDate(job.createdAt),
        company: (job) => getCompany(job.companyId),
    }
}

function toLocaleDate (value) {
    const date = new Date(value);
    return date.toLocaleDateString();
}