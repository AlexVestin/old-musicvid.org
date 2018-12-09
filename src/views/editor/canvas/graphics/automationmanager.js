

const lerp = function (value1, value2, amount) {
	amount = amount < 0 ? 0 : amount;
	amount = amount > 1 ? 1 : amount;
	return value1 + (value2 - value1) * amount;
};

export default class AutomationManager {

    constructor() {
        this.automations = []
    }

    editAutomation = (payload) => {
        let idx = this.automations.findIndex( e => e.id === payload.id)
        this.automations[idx][payload.key] = payload.value 
    }

    removeAutomation = (payload) => {
        this.automations = this.automations.filter(e => e.id !== payload.id)
    }

    addAutomation = (payload) =>  {
        this.automations.push({id: payload.id, points: [], type: "Points", amplitude: 1, speed: 1, constant: 0, offset: 0})
    }

    removeAutomationPoint = (payload) => {
        let idx = this.automations.findIndex( e => e.id === payload.id);
        let pointIdx = this.automations[idx].points.findIndex(e => e.id === payload.pointId);
        this.automations[idx].points.splice(pointIdx, 1)
    }


    addPoint = (payload) => {
        let idx = this.automations.findIndex( e => e.id === payload.id);
        this.automations[idx].points.push({time: 0, value: 0, id: payload.pointId});
    }

    editPoint = (payload) => {
        let idx = this.automations.findIndex( e => e.id === payload.id);
        let pointIdx = this.automations[idx].points.findIndex(e => e.id === payload.pointId);
        this.automations[idx].points[pointIdx][payload.key] = payload.value;
    }

    getAutomationValues = (time) => {
        let idValuePairs = []
        this.automations.forEach(automation =>  {
            const  {offset, speed, constant, amplitude} = automation 

            if(automation.type === "Sin") {
                idValuePairs.push([{id: automation.id, value: constant + amplitude*Math.sin(offset + time * speed)}])
            }else if( automation.type === "Cos") {
                idValuePairs.push([{id: automation.id, value: constant + amplitude*Math.cos(offset + time * speed)}])
            }else if ( automation.type === "Points") {

                if(automation.points.length > 0) {
                    const sortedPoints = automation.points.concat().sort((a,b) => a.time - b.time)
                    let idx = sortedPoints.findIndex(e => time >= Number(e.time));
                    let point;
                    if(idx !== -1) {
                        point = sortedPoints[idx];
                    }else {
                        point = sortedPoints[0];
                    }
                    
                    let otherPoint = null, amt = 1; 
                    
                    if(idx === -1) {
                        amt = time / Number(point.time);
                        idValuePairs.push({id: automation.id, value: lerp(0, Number(point.value), amt)});
                    }else if (idx === sortedPoints.length - 1) {
                        idValuePairs.push({id: automation.id, value: Number(point.value)});
                    }else {
                        otherPoint = sortedPoints[idx + 1];
                        amt = (time - Number(point.time)) / ( Number(otherPoint.time) -  Number(point.time));
                        idValuePairs.push({id: automation.id, value: lerp(Number(point.value), Number(otherPoint.value), amt)});
                    }
                }
               
            }
        })

        return idValuePairs;
    } 
}