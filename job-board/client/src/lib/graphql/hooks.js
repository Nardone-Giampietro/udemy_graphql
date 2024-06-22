import {useQuery, useMutation} from "@apollo/client";

import {companyByIdQuery, jobByIdQuery, jobsQuery, createJobMutation} from "./queries";

export function useCompany(id){
    const {loading, error, data} = useQuery(companyByIdQuery, {
        variables: {id: id}
    });
    return {company: data?.company, loading, error: Boolean(error)};
}

export function useJob(id){
    const {loading, error, data} = useQuery(jobByIdQuery, {
        variables: {id: id},
    });
    return {job: data?.job, loading, error: Boolean(error)};
}

export function useJobs({limit, offset}){
    const {loading, error, data} = useQuery(jobsQuery, {
        fetchPolicy: "network-only",
        variables: {limit, offset}
    });
    return {jobs: data?.jobs, loading, error: Boolean(error)};
}