var m = require('mithril');
import {apiBaseUrl} from '../../param';

const Task = {

	view: function (vnode) {
		const task = vnode.attrs;
		const lastDone = new Date(task.lastDone);
		const urgency = (Date.now()-lastDone.getTime()) /
					(task.frequency*(1000*60*60*24));
		const points = task.pointMultiplier * task.effort * urgency;
		return (			 
			<tr>
				<td>{task.room}</td>
				<td>{task.object}</td>
				<td>
					{('00'+lastDone.getDate()).slice(-2)}.
					{('00'+(lastDone.getMonth()+1)).slice(-2)}.
				</td>
				<td>{urgency.toFixed(1)}</td>
				<td>{points.toFixed(2)}</td>
				<td>
					<button
					>
						Erledigt
					</button>
				</td>
			</tr>
		);
	},

		return m.request({
			method: 'PATCH',
		});
	},
};

export default Task;
