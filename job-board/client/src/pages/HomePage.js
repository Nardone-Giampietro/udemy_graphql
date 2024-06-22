import JobList from '../components/JobList';
import {useJobs} from "../lib/graphql/hooks";

function HomePage() {
    const {error, jobs, loading} = useJobs();
    if (error){
        return <div className="has-text-danger"> Data unavailable</div>;
    }
    if (loading){
        return <div>Loading...</div>;
    }
    return (
        <div>
            <h1 className="title">
                Job Board
            </h1>
            <JobList jobs={jobs} />
        </div>
    );
}

export default HomePage;
