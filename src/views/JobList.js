import m from "mithril";
import Job from "../components/Job";
import {apiBaseUrl} from '../../param';

const JobList = {
  
  list: [],
  pointMultiplier: 1,
	
	oninit: function() {
    return m.request({
			method: "GET",
			url: apiBaseUrl + "jobs",
    })
    .then(function(result) {
			JobList.list = result;
			const numberOfMembers = 5;
			JobList.pointMultiplier = numberOfMembers / result.reduce(
				(sum, job) => {return sum + job.effort/job.frequency;}
				,0);
    })
  },
	
	view: function() {
		return (
			<div>
				<h1>Jobs</h1>
				<table>
					<thead>
						<tr>
							<th>Aufgabe</th>
							<th>Freq.</th>
							<th>Zuletzt</th>
							<th>Dringlichkeit</th>
							<th>Punkte</th>
							<th>Aktion</th>
						</tr>
					</thead>
					<tbody>
						{JobList.list.map(job => {return m(Job, {
							...job,
							pointMultiplier: JobList.pointMultiplier,
						})})}
					</tbody>
				</table>
			</div>
		);
	},
};

export default JobList;
