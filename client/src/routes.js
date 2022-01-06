
import Dashboard from "@material-ui/icons/Dashboard";
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
/* import Person from "@material-ui/icons/Person"; */
/* import Home from "@material-ui/icons/Home" */
// core components/views for Admin layout
import General from "./views/GeneralVision/GeneralVision.js";
import Interacciones from "./views/Interaccion/Interaccion.js";
import Intencionalidad from "./views/Intencionalidad/Intencionalidad.js"
/* import UserProfile from "./views/UserProfile/UserProfile.js"; */
import CrudEmployee from "./views/CRUD/CrudEmployee"
import CrudTeams from "./views/CRUD/CrudTeams"
/* import PersonalVision from "views/PersonalVision/PersonalVision.js"; */
import Top_10 from "./views/Top_10/Top_10.js";
import GestionPolls from "./views/Polls/ProgramPoll.js";
import AnalysisPolls from "./views/Polls/AnalysisPoll.js";
import Conversaciones from "./views/Conversaciones/Conversaciones.js"


const dashboardRoutes = [
  {
    path: "/Conversaciones",
    name: "Conversaciones",
    icon: Dashboard,
    component: Conversaciones,
    layout: "/admin"
  },
  {
    path: "/visionGeneral",
    name: "General",
    icon: SubdirectoryArrowRightIcon,
    component: General,
    layout: "/admin"
  },
  {
    path: "/Intencionalidad",
    name: "Intencionalidad",
    icon: SubdirectoryArrowRightIcon,
    component: Intencionalidad,
    layout: "/admin"
  },
  {
    path: "/Interacciones",
    name: "Interacciones",
    icon: SubdirectoryArrowRightIcon,
    component: Interacciones,
    layout: "/admin"
  },
  {
    path: "/Top_10",
    name: "Top 10",
    icon: SubdirectoryArrowRightIcon,
    component: Top_10,
    layout: "/admin"
  },
  {
    path: "/Encuestas",
    name: "Encuestas",
    icon: Dashboard,
    component: Conversaciones,
    layout: "/admin"
  },
  {
    path: "/Gestion",
    name: "Gestión",
    icon: SubdirectoryArrowRightIcon,
    component: GestionPolls,
    layout: "/admin"
  },
  {
    path: "/Analisis",
    name: "Análisis",
    icon: SubdirectoryArrowRightIcon,
    component: AnalysisPolls,
    layout: "/admin"
  },
  
  /*  { */
  /*    path: "/user", */
  /*    name: "Perfil de Usuario", */
  /*    rtlName: "ملف تعريفي للمستخدم", */
  /*    icon: Person, */
  /*    component: UserProfile, */
  /*    layout: "/admin" */
  /*  }, */
  {
    path: "/Administracion",
    name: "Administración",
    icon: Dashboard,
    component: Conversaciones,
    layout: "/admin"
  },
  {
    path: "/Empleados",
    name: "Empleados",
    icon: SubdirectoryArrowRightIcon,
    component: CrudEmployee,
    layout: "/admin"
  },
  {
    path: "/Equipos",
    name: "Equipos",
    icon: SubdirectoryArrowRightIcon,
    component: CrudTeams,
    layout: "/admin"
  }
  /*,
{
  path: "/typography",
  name: "Typography",
  rtlName: "طباعة",
  icon: LibraryBooks,
  component: Typography,
  layout: "/admin"
},
{
  path: "/icons",
  name: "Icons",
  rtlName: "الرموز",
  icon: BubbleChart,
  component: Icons,
  layout: "/admin"
},
{
  path: "/maps",
  name: "Maps",
  rtlName: "خرائط",
  icon: LocationOn,
  component: Maps,
  layout: "/admin"
},
{
  path: "/notifications",
  name: "Notifications",
  rtlName: "إخطارات",
  icon: Notifications,
  component: NotificationsPage,
  layout: "/admin"
},
{
  path: "/rtl-page",
  name: "RTL Support",
  rtlName: "پشتیبانی از راست به چپ",
  icon: Language,
  component: RTLPage,
  layout: "/rtl"
} */
];

export default dashboardRoutes;
