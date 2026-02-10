// import { ELocalStorageKeys } from "@/enums";
// import { getNumberFromStorage } from "../formats";
// import axios from "axios";
// import { getInstance } from "../configAxios";
// import { IValidateRouteResponse } from "@/interfaces";


// export const API_VERSION_SEC = import.meta.env.VITE_API_VERSION_SEC;

// export const simpleAxiosInstance = axios.create({
//     baseURL: `${import.meta.env.VITE_API}`,
//     headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//     },
// });


// export const securityApi = getInstance(simpleAxiosInstance);

// export const validateRouteAccessApi = async (routePath: string) => {
//     const agencyId = getNumberFromStorage(ELocalStorageKeys.agencyId);
//     if (agencyId !== null) {
//         try {
//             const responseApiValidateRoute =
//                 await securityApi.get<IValidateRouteResponse>(
//                     `${import.meta.env.VITE_API_VERSION_SEC}/validate-route`,
//                     {
//                         params: { path: routePath, agency_id: agencyId },
//                     }
//                 );
//             if (responseApiValidateRoute.data.code === 1) {
//                 return responseApiValidateRoute.data.result;
//             } else {
//                 return null;
//             }
//         } catch (error) {
//             console.error("error =>", error);
//             return null;
//         }
//     } else {
//         return null;
//     }
// };


// export const validateProgramsRolesAndTemporalPrograms = async (locationPathname: string) => {
//     const newPath = `${EMicroFrontends.itsaFrontoffice}${locationPathname}`;
//     const vaidateRouteAccess = await validateRouteAccessApi(newPath);
//     const programsRoleUser = vaidateRouteAccess?.programs_role_user ?? [];
//     const programsTemporalUser = vaidateRouteAccess?.programs_temporal_user ?? [];
//     const userHasAccess =
//         programsRoleUser.length > 0 || programsTemporalUser.length > 0;

//     if (userHasAccess) {
//         const actions = {
//             create: false,
//             update: false,
//             delete: false,
//             read: false,
//             allActions: false,
//             programId: -1,
//             agencyId: -1,
//             path: "",
//         }
//         const agencyId = getNumberFromStorage(ELocalStorageKeys.agencyId);
//         const programId = programsRoleUser[0]?.program_id;
//         if (programId && agencyId) {
//             actions.programId = programId;
//             actions.agencyId = agencyId;
//             actions.path = locationPathname;
//             const responseCreate: boolean = await validateActionExecute(EActionType.create, programId, agencyId);
//             if (responseCreate) {
//                 actions.create = true;
//             }
//             const responseUpdate: boolean = await validateActionExecute(EActionType.update, programId, agencyId);
//             if (responseUpdate) {
//                 actions.update = true;
//             }
//             const responseDelete: boolean = await validateActionExecute(EActionType.delete, programId, agencyId);
//             if (responseDelete) {
//                 actions.delete = true;
//             }
//             const responseRead: boolean = await validateActionExecute(EActionType.read, programId, agencyId);
//             if (responseRead) {
//                 actions.read = true;
//             }
//             const responseList: boolean = await validateActionExecute(EActionType.allActions, programId, agencyId);
//             if (responseList) {
//                 actions.allActions = true;
//             }
//         }
//         console.log('actions =>', actions);
//         return actions;
//     }
//     return null;
// };


// export const validateActionExecute = async (
//     actionTypeId: number,
//     programId: number,
//     agencyId: number,
// ) => {
//     try {
//         const { data } = await securityApi.get<IValidateRouteResponse>(
//             `${import.meta.env.VITE_API}/validate-permissions`,
//             {
//                 params: {
//                     program_id: programId,
//                     agency_id: agencyId,
//                     action: actionTypeId,
//                 },
//             }
//         );
//         return data.result;
//     } catch (error) {
//         console.log("error =>", error);
//         return false;
//     }
// };
