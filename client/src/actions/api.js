import axios from "axios";

/* const baseUrl = 'http://localhost:8080/' */

const baseUrl = 'http://' + window.location.hostname + ':8080/'//process.env.REACT_APP_SERVER_URL //'http://100.26.46.75:8080/'
const teams = baseUrl + 'team/';

export default {
    employee(url = baseUrl + 'employee/') {
        return {
            fetchAll: () => axios.get(url),
            fetchById: id => axios.get(url + id),
            create: newRecord => axios.post(url, newRecord),
            update: (id, updatedRecord) => axios.put(url + id, updatedRecord),
            delete: id => axios.delete(url + id),
            fetchAllTeams: () => axios.get(teams)
        }
    },
    team(url = baseUrl + 'team/') {
        return {
            fetchAll: () => axios.get(url),
            fetchById: id => axios.get(url + id),
            create: newRecord => axios.post(url, newRecord),
            update: (id, updatedRecord) => axios.put(url + id, updatedRecord),
            delete: id => axios.delete(url + id)
        }
    },
    sendPolls(url = baseUrl + 'sendPolls') {
        return {
            send: newRecord => axios.post(url, newRecord)
        }
    },
    typeformForms(url = baseUrl + 'forms') {
        return {
            fetchAll: () => axios.get(url),
            fetchById: id => axios.get(url + '/id' + id)
        }
    },
    weekMessages(url = baseUrl + 'weekMessages') {
        return {
            fetchAll: () => axios.get(url)
        }
    },
    messages7Days(url = baseUrl + 'messages7Days') {
        return {
            fetchAll: () => axios.get(url)
        }
    },
    topWords(url = baseUrl + 'topWords') {
        return {
            fetchAll: () => axios.get(url)
        }
    },
    generalVision(url = baseUrl + 'generalVision') {
        return {
            fetchAll: () => axios.get(url)
        }
    }
}