import { combineReducers } from "redux";
import { employee } from "./employee";
import { team } from "./team";
import { sendPolls } from "./sendPolls";
import { typeformForms } from "./typeformForms";
import { generalVision } from "./generalVision";
import { messages7Days } from "./messages7Days";
import { topWords } from "./topWords";
import { weekMessages } from "./weekMessages";

export const reducers = combineReducers({
    employee,
    team,
    sendPolls,
    typeformForms,
    generalVision,
    messages7Days,
    topWords,
    weekMessages
})