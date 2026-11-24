
// import React, {useState,useEffect} from 'react';
// import "./dashboard.css";
// import Navbar from "../Navbar";


// const Dashboard=()=>{
//        const [repositories,setRepositories]=useState([]);
//        const [searchQuery,setSearchQuery]=useState("");
//        const [suggestedRepositories,setSuggestedRepositories]=useState([]);
//        const [searchResults,setSearchResults]=useState([]);

//        useEffect(()=>{
//            const userId=localStorage.getItem("userId");

//            const fetchRepositories = async ()=>{
//               try{
//                const response=await fetch(`http://localhost:3000/repo/user/${userId}`);
               
//                const data= await response.json();
//                setRepositories(data.repositories);
//               }
//               catch(err){
//                   console.error("error while  fetching repositories",err);
                  
//               }
//            };




//            const fetchSuggestedRepositories = async ()=>{
//               try{
//                const response=await fetch(`http://localhost:3000/repo/all`);
//                const data= await response.json(); 
//               setSuggestedRepositories(data);
//               console.log(suggestedRepositories);
//               }
//               catch(err){
//                   console.error("error while  fetching repositories",err);
//               }
//            };

//            fetchRepositories();
//            fetchSuggestedRepositories();
//          },[]);

//          useEffect(()=>{
//             if(searchQuery==""){
//                 setSearchResults(repositories);
//             }else{
//                 const filteredRepo=repositories.filter((repo)=>repo.name.toLowerCase().includes(searchQuery.toLocaleLowerCase())
//             );
//             setSearchResults(filteredRepo);
//             }
//          },[searchQuery,repositories]);

//          return( 
//             <>
//             <Navbar/>
//         <section id="dashboard" >
//             <aside>
//               <h3>Suggested Repositories</h3> 
//               {suggestedRepositories.map((repo)=>{
//                 return(
//                 <div key={repo._id}>
//                     <h4>{repo.name}</h4>
//                       <h4>{repo.description}</h4>
//                 </div>
//                 );
//               })}
//             </aside>
//             <main>
//             <h2>Your Repositories</h2> 
//           <div id="search">
//             <input
//               type="text"
//               value={searchQuery}
//               placeholder="Search..."
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
          
//               {searchResults.map((repo)=>{
//                 return(
//                 <div key={repo._id}>
//                     <h4>{repo.name}</h4>
//                       <h4>{repo.description}</h4>
//                 </div>
//                 );
//               })}
//             </main>
//             <aside>
//                 <h3>Upcoming Events</h3>
//                 <ul>
//                     <li><p>Tech Conferance -Dec 15</p></li>
//                     <li><p>Devloper Meetup -feb 5</p></li>
//                     <li><p>React Summit    -jan 25</p></li>
//                 </ul>
//             </aside>
//         </section>
//         </>
//          );


// };

// export default Dashboard;


import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Navbar from "../Navbar";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    console.log("Current userId from localStorage:", userId);

    const fetchRepositories = async () => {
      if (!userId || userId === "undefined" || userId === "null") {
        console.warn("userId missing in localStorage");
        setRepositories([]);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/repo/user/${userId}`);
        const data = await response.json();
        console.log("User repos response:", data);

        if (!response.ok) {
          setErrorMsg(data?.message || "Failed to load user repositories");
          setRepositories([]);
          return;
        }

        const repoList = Array.isArray(data)
          ? data
          : Array.isArray(data?.repositories)
          ? data.repositories
          : Array.isArray(data?.repos)
          ? data.repos
          : [];

        setRepositories(repoList);
      } catch (err) {
        console.error("Error while fetching repositories:", err);
        setErrorMsg("Backend connection error while fetching repositories");
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch("http://localhost:3000/repo/all");
        const data = await response.json();
        console.log("All/Suggested repos response:", data);

        if (!response.ok) {
          setSuggestedRepositories([]);
          return;
        }

        const allRepos = Array.isArray(data)
          ? data
          : Array.isArray(data?.repositories)
          ? data.repositories
          : Array.isArray(data?.repos)
          ? data.repos
          : [];

        setSuggestedRepositories(allRepos);
      } catch (err) {
        console.error("Error while fetching suggested repositories:", err);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(repositories);
    } else {
      const q = searchQuery.toLowerCase();
      const filteredRepo = repositories.filter((repo) =>
        (repo?.name || "").toLowerCase().includes(q)
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  return (
    <>
      <Navbar />
      <section id="dashboard">
        <aside className="aside">
          <h3>Suggested Repositories</h3>
          {suggestedRepositories.length === 0 ? (
            <p>No suggested repositories found.</p>
          ) : (
            suggestedRepositories.map((repo) => (
              <div key={repo?._id || repo?.id || repo?.name}>
                <h4>{repo?.name ?? "Unnamed Repo"}</h4>
                <p>{repo?.description ?? "No description"}</p>
              </div>
            ))
          )}
        </aside>

        <main>
          <h2>Your Repositories</h2>
          {errorMsg && <p>{errorMsg}</p>}
          <div id="search">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {searchResults.length === 0 ? (
            <p>No repositories found.</p>
          ) : (
            searchResults.map((repo) => (
              <div key={repo?._id || repo?.id || repo?.name}>
                <h4>{repo?.name ?? "Unnamed Repo"}</h4>
                <p>{repo?.description ?? "No description"}</p>
              </div>
            ))
          )}
        </main>

        <aside>
          <h3>Upcoming Events</h3>
          <ul>
            <li>
              <p>Tech Conference - Dec 15</p>
            </li>
            <li>
              <p>Developer Meetup - Feb 5</p>
            </li>
            <li>
              <p>React Summit - Jan 25</p>
            </li>
          </ul>
        </aside>
      </section>
    </>
  );
};

export default Dashboard; 