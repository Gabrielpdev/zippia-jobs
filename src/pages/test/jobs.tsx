import { useEffect, useState } from "react";
import { api } from "../../service";

type IJob = {
  postedDate: string;
  jobId: string;
  jobTitle: string;
  companyLogo: string;
  companyName: string;
  OBJurl: string;
  jobDescription: string;
};

type IComponentProps = {
  data: IJob[];
};

export default ({ data }: IComponentProps) => {
  console.log(data);

  const [jobs, setJobs] = useState<IJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<IJob | null>(null);

  //filter jobs by posted last week
  function handleFilterJobsBy7Days() {
    setJobs(
      jobs.filter((job) => {
        return Number(job.postedDate.replace("d ago", "")) <= 7;
      })
    );
    setSelectedJob(null);
  }

  // select a job
  function handleSelectedJob(job: IJob) {
    setSelectedJob(job);
  }

  // filter the 10 firsts jobs
  function listFirst10Jobs() {
    const jobsFiltered = data?.filter((_: IJob, index: number) => index < 10);

    // update the state
    setJobs(jobsFiltered);
  }

  useEffect(() => {
    listFirst10Jobs();
  }, []);

  return (
    <>
      <main className="bg-gradient-to-b to-slate-100 via-indigo-500 from-indigo-500 min-h-screen">
        <h1 className="font-bold text-4xl mb-3 bg-indigo-600 p-10 text-white align-middle">
          Find your job
        </h1>

        <div className="flex space-x-2 justify-between mx-20 max-[600px]:mx-1">
          <button
            onClick={handleFilterJobsBy7Days}
            type="button"
            className="inline-block px-6 py-2.5 bg-orange-700 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-orange-800 hover:shadow-lg focus:bg-orange-800 focus:shadow-lg focus:outline-none focus:ring-0"
          >
            Jobs published in the last week.
          </button>

          <span className="inline-block px-6 py-2.5 text-white font-bold text-xs leading-tight uppercase rounded">
            Total jobs: {jobs.length}
          </span>
        </div>

        <div className="flex py-5 px-10 gap-5 w-full max-[600px]:px-2">
          <div
            className={`flex flex-col py-5 px-5 gap-5 w-1/3 overflow-auto h-full max-[600px]:px-1 ${
              selectedJob ? "max-[1024px]:hidden" : "max-[1024px]:w-full"
            }`}
          >
            {jobs?.map((job) => (
              <button
                onClick={() => handleSelectedJob(job)}
                key={job.jobId}
                className={`bg-indigo-800 w-full items-center p-3 justify-center rounded-md ${
                  job.jobId === selectedJob?.jobId
                    ? "border-2 border-indigo-200"
                    : ""
                }`}
              >
                <p className="text-white font-bold text-2xl mb-0 max-[600px]:text-2xl">
                  {job?.jobTitle}
                </p>

                <div className="flex max-[600px]:flex-col justify-between my-5">
                  <div className="flex gap-3 align-center my-5">
                    <img className="w-10 h-10" src={job.companyLogo} alt="" />
                    <div className="">
                      <p className="text-white text-xl">{job?.companyName}</p>
                      <p className="text-white text-xs text-left">
                        {job?.postedDate}
                      </p>
                    </div>
                  </div>
                </div>
                <p
                  className="text-white text-base h-36 text-left line-clamp-6"
                  dangerouslySetInnerHTML={{ __html: job?.jobDescription }}
                />
              </button>
            ))}
          </div>

          {selectedJob ? (
            <div
              className={`flex flex-col py-5 w-2/3 max-[1024px]:absolute max-[1024px]:w-11/12 ${
                !selectedJob ? "max-[1024px]:hidden" : ""
              }`}
            >
              <div
                className={` bg-indigo-800 w-full items-center p-3 justify-center rounded-md`}
              >
                <div className="flex gap-5">
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="max-[1024px]:flex hidden items-center justify-center p-0 text-center border-0 hover:outline-none hover:no-underline focus:outline-none focus:no-underline"
                    type="button"
                  >
                    <span
                      className="carousel-control-prev-icon inline-block bg-no-repeat"
                      aria-hidden="true"
                    />
                  </button>
                  <p className="text-white font-bold text-2xl mb-0 max-[600px]:text-2xl">
                    {selectedJob?.jobTitle}
                  </p>
                </div>

                <div className="flex max-[600px]:flex-col justify-between my-5">
                  <div className="flex gap-3 align-center my-5">
                    <img
                      className="w-10 h-10"
                      src={selectedJob?.companyLogo}
                      alt=""
                    />
                    <div className="">
                      <p className="text-white text-xl">
                        {selectedJob?.companyName}
                      </p>
                      <p className="text-white text-xs text-left">
                        {selectedJob?.postedDate}
                      </p>
                    </div>
                  </div>

                  <a
                    target="_blank"
                    href={selectedJob?.OBJurl}
                    type="button"
                    className="h-10 align-middle text-center px-10 py-2.5 bg-orange-700 text-white font-medium text-xs  uppercase rounded shadow-md hover:bg-orange-800 hover:shadow-lg focus:bg-orange-800 focus:shadow-lg focus:outline-none focus:ring-0"
                  >
                    Apply
                  </a>
                </div>
                <p
                  className="text-white text-base "
                  dangerouslySetInnerHTML={{
                    __html: selectedJob?.jobDescription ?? "",
                  }}
                />
              </div>
            </div>
          ) : (
            <p className="text-white font-bold text-4xl mx-auto flex w-96 mt-20 justify-center max-[1024px]:hidden">
              Select a job
            </p>
          )}
        </div>
      </main>
    </>
  );
};

export const getServerSideProps = async () => {
  // fetch api on server side
  const { data } = await api.post("", {
    companySkills: true,
    dismissedListingHashes: [],
    fetchJobDesc: true,
    jobTitle: "Business Analyst",
    locations: [],
    numJobs: 20,
    previousListingHashes: [],
  });

  return {
    props: { data: data?.jobs },
  };
};
