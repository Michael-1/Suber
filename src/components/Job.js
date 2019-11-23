var m = require('mithril');
import {apiBaseUrl} from '../../param';

const Job = {

	view: function (vnode) {
		const job = vnode.attrs;
		const lastDone = new Date(job.lastDone);
		const urgency = (Date.now()-lastDone.getTime()) /
					(job.frequency*(1000*60*60*24));
		const points = job.pointMultiplier * job.effort * urgency;
		return (			 
			<tr>
				<td>{job.room}</td>
				<td>{job.object}</td>
				<td>
					{('00'+lastDone.getDate()).slice(-2)}.
					{('00'+(lastDone.getMonth()+1)).slice(-2)}.
				</td>
				<td>{urgency.toFixed(1)}</td>
				<td>{points.toFixed(2)}</td>
				<td>
					<button
						data-id={job.id}
					>
						Erledigt
					</button>
				</td>
			</tr>
		);
	},

	markAsDone: function(id) {
		return m.request({
			method: 'PATCH',
			url: apiBaseUrl + 'job/' + id + '/done',
		});
	},
};

export default Job;
