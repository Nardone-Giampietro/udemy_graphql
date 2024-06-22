import {getAccessToken} from "../auth";
import {ApolloClient, gql, concat,createHttpLink, InMemoryCache, ApolloLink} from "@apollo/client"

const httpLink = new createHttpLink({
    uri: "http://localhost:9000/graphql"
});

const authLink = new ApolloLink((operation, forward) => {
    const accessToken = getAccessToken();
    if (accessToken) {
        operation.setContext({
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
    }
    return forward(operation);
});

export const apolloClient = new ApolloClient({
    link: concat(authLink, httpLink),
    cache: new InMemoryCache()
});

const fullJobDetailsFragment = gql`
    fragment JobDetails on Job {
        id
        date
        title
        description
        company {
            id
            name
        }
    }
`;

export const companyByIdQuery = gql`
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

export const jobByIdQuery = gql`
    query ($id: ID!) {
        job(id: $id) {
            ...JobDetails
        }
    }
    ${fullJobDetailsFragment}
`;

export const jobsQuery = gql`
    query Jobs($limit: Int, $offset: Int) {
        jobs (limit: $limit, offset: $offset) {
            items {
                id
                date
                title
                company {
                    id
                    name
                }
            }
            totalCount
        }
    }
`;

export async function createJob({title, description}) {
    const mutation = gql`
        mutation ( $input: CreateJobInput! ) {
            job: createJob(input: $input) {
                ...JobDetails
            }
        }
        ${fullJobDetailsFragment}
    `;
    const variables = {
        input: {title, description},
    }
    const {data} = await apolloClient.mutate({mutation, variables: variables});
    const writeQuery = gql`
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
    const writeData ={
        job: {__typename: 'Job',...data.job}
    };
    const writeVariables = {
        id: data.job.id
    }
    await apolloClient.writeQuery({
        query: writeQuery,
        data: writeData,
        variables: writeVariables
    });
    return data.job;
}