export interface IVehiclePart {
  id: string;
  label: string;
}

export interface IVehiclePartGroup {
  partId: string;
  pathIds: string[];
}

export const VEHICLE_PARTS_RIGHT_SIDE: Record<string, IVehiclePart> = {
  'front-bumper': { id: 'front-bumper', label: 'Bumper frontal' },
  'hood': { id: 'hood', label: 'Capó' },
  'front-fender': { id: 'front-fender', label: 'Guardafango delantero' },
  'windshield': { id: 'windshield', label: 'Parabrisas' },
  'front-door-window': { id: 'front-door-window', label: 'Ventana puerta delantera' },
  'rear-door-window': { id: 'rear-door-window', label: 'Ventana puerta trasera' },
  'front-door': { id: 'front-door', label: 'Puerta delantera' },
  'rear-door': { id: 'rear-door', label: 'Puerta trasera' },
  'side-mirror': { id: 'side-mirror', label: 'Espejo lateral' },
  'roof': { id: 'roof', label: 'Techo' },
  'rear-quarter-panel': { id: 'rear-quarter-panel', label: 'Panel trasero lateral' },
  'trunk': { id: 'trunk', label: 'Maletero' },
  'rear-bumper': { id: 'rear-bumper', label: 'Bumper trasero' },
  'tail-light': { id: 'tail-light', label: 'Luz trasera' },
  'front-wheel': { id: 'front-wheel', label: 'Rueda delantera' },
  'rear-wheel': { id: 'rear-wheel', label: 'Rueda trasera' },
  'rocker-panel': { id: 'rocker-panel', label: 'Estribo' },
  'headlight': { id: 'headlight', label: 'Faro delantero' },
};

export const VEHICLE_PART_GROUPS_RIGHT_SIDE: IVehiclePartGroup[] = [
  { partId: 'front-bumper', pathIds: ['Vector_30'] },
  { partId: 'hood', pathIds: ['Vector_24', 'Vector_25'] },
  { partId: 'front-fender', pathIds: ['Vector_26', 'Vector_31'] },
  { partId: 'windshield', pathIds: ['Vector_6'] },
  { partId: 'front-door-window', pathIds: ['Vector_16'] },
  { partId: 'rear-door-window', pathIds: ['Vector_17'] },
  { partId: 'front-door', pathIds: ['Vector_11'] },
  { partId: 'rear-door', pathIds: ['Vector_27'] },
  { partId: 'side-mirror', pathIds: ['Vector_7', 'Vector_8', 'Vector_9', 'Vector_10'] },
  { partId: 'roof', pathIds: ['Vector_28', 'Vector_29', 'Vector_32', 'Vector_37', 'Vector_39'] },
  { partId: 'rear-quarter-panel', pathIds: ['Vector_12', 'Vector_13', 'Vector_14', 'Vector_15'] },
  { partId: 'trunk', pathIds: ['Vector_18', 'Vector_34', 'Vector_35', 'Vector_36'] },
  { partId: 'rear-bumper', pathIds: ['Vector_33', 'Vector_19', 'Vector_20'] },
  { partId: 'tail-light', pathIds: ['Vector_21', 'Vector_22'] },
  { partId: 'front-wheel', pathIds: ['Vector_43', 'Vector_44', 'Vector_45', 'Vector_4', 'Vector_5'] },
  { partId: 'rear-wheel', pathIds: ['Vector_40', 'Vector_41', 'Vector_42'] },
  { partId: 'rocker-panel', pathIds: ['Vector_23'] },
  { partId: 'headlight', pathIds: ['Vector_38'] },
];

export const PATH_TO_PART_MAP: Record<string, string> = {};
VEHICLE_PART_GROUPS_RIGHT_SIDE.forEach((group) => {
  group.pathIds.forEach((pathId) => {
    PATH_TO_PART_MAP[pathId] = group.partId;
  });
});
