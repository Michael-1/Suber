import m from "mithril";
import Task from "../components/Task";
import {apiBaseUrl} from '../../param';

const TaskList = {
  
  list: [],
  pointMultiplier: 1,
	
	oninit: function() {
    return m.request({
			method: "GET",
			url: apiBaseUrl + "tasks",
    })
    .then(function(result) {
			TaskList.list = result;
			const numberOfMembers = 5;
			TaskList.pointMultiplier = numberOfMembers / result.reduce(
				(sum, task) => {return sum + task.effort/task.frequency;}
				,0);
    })
  },
	
	view: function() {
		return (
			<div>
				<h1>Tasks</h1>
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
						{TaskList.list.map(task => {return m(Task, {
							...task,
							pointMultiplier: TaskList.pointMultiplier,
						})})}
					</tbody>
				</table>
			</div>
		);
	},
};

export default TaskList;
