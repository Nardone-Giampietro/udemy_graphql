import JobList from '../components/JobList';
import {useJobs} from "../lib/graphql/hooks";
import {useState} from "react";

const JOB_PER_PAGE = 3;

function HomePage() {
    const [currentPage, setCurrentPage] = useState(1);
    const {error, jobs, loading} =
        useJobs({
            limit:JOB_PER_PAGE,
            offset:(currentPage - 1) * JOB_PER_PAGE
        });
    if (error){
        return <div className="has-text-danger"> Data unavailable</div>;
    }
    if (loading){
        return <div>Loading...</div>;
    }
    const totalPages = Math.ceil(jobs.totalCount / JOB_PER_PAGE);
    return (
        <div>
            <h1 className="title">
                Job Board
            </h1>
            <div>
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                <span>{currentPage}</span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
            </div>
            <JobList jobs={jobs.items} />
        </div>
    );
}

export default HomePage;
