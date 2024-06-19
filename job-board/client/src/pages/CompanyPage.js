import { useParams } from 'react-router';
import {getCompany} from "../lib/graphql/queries";
import {useEffect, useState} from "react";
import JobList from "../components/JobList";

function CompanyPage() {
  const { companyId } = useParams();
  const [state, setState] = useState({
      companyData: null,
      loading: true,
      error: false,
  })
  useEffect(() => {
      (async () => {
          try {
              const companyData = await getCompany(companyId);
              setState({companyData, loading: false, error: false});
          }catch (error) {
              setState({companyData: null,loading: false,error: true});
          }
      })();
  },[companyId]);
  const {companyData, loading, error} = state;
  if (error){
      return <div className="has-text-danger"> Data unavailable</div>;
  }
  if (!companyData){
      return <div>Loading...</div>;
  }
  return (
    <div>
      <h1 className="title">
        {companyData.name}
      </h1>
      <div className="box">
        {companyData.description}
      </div>
        <h2 className="title is-5">
            Jobs at {companyData.name}
        </h2>
        <JobList jobs={companyData.jobs} />
    </div>
  );
}

export default CompanyPage;
