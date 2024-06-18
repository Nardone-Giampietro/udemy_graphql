import { useParams } from 'react-router';
import {getCompany} from "../lib/graphql/queries";
import {useEffect, useState} from "react";
import JobList from "../components/JobList";

function CompanyPage() {
  const { companyId } = useParams();
  const [companyData, setCompanyData] = useState();
  useEffect(() => {
      getCompany(companyId).then(setCompanyData);
  },[companyId]);
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
