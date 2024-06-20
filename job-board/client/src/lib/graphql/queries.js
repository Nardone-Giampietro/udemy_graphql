import {GraphQLClient, gql} from "graphql-request"
import {getAccessToken} from "../auth";

const client = new GraphQLClient(`http://localhost:9000/graphql`,{
    headers: () => {
        const token = getAccessToken();
        if (!token) return {};
        return {"Authorization": `Bearer ${token}`};
    }
});

export async function createJob({title, description}) {
    const document = gql`
        mutation ( $input: CreateJobInput! ) {
            job: createJob(input: $input) {
                id
            }
        }
    `
    const variables = {
        input: {title, description},
    }
    const data = await client.request({document, variables});
    return data.job;
}

export async function getJobs(){
    const query = gql`
        query {
            jobs {
                id
                date
                title
                company {
                    id
                    name
                }
            }
        }
    `
    const data = await client.request(query);
    return data.jobs;
}

export async function getJob(id){
    const query = gql`
        query ($id: ID!) {
            job(id: $id) {
                id
                date
                title
                description
                company {
                    id
                    name
                }
            }
        }
    `;
    const data = await client.request(query, {id: id});
    return data.job;
}

export async function getCompany(id){
    const query = gql`
        query ($id: ID!){
            company(id: $id) {
                id
                name
                description
                jobs {
                    id
                    date
                    title
                    company {
                        name
                    }
                }
            }
        }
    `;
    const data = await client.request(query, {id: id});
    return data.company;
}