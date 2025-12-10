import { usePageResponseSuccess } from '../../../utils/response';

// Mock 设备型号数据（基于新的 device_model 表结构）
const MOCK_DEVICE_MODELS = [
  {
    id: 1,
    code: 'TEMP001',
    name: '温度传感器',
    manufacturer: 'IoT Corp',
    thingModelId: 1,
    thingModelName: '温度传感器物模型',
    properties: {
      temperature: { type: 'float', unit: '°C', min: -40, max: 85, precision: 1, default: 20, readable: true, writable: false },
    },
    services: ['read_temperature', 'calibrate', 'set_precision', 'reset_calibration'],
    events: ['temperature_alert', 'sensor_fault', 'calibration_complete', 'low_battery'],
    deviceCount: 156,
    createdAt: '2024-01-01 00:00:00',
  },
  {
    id: 2,
    code: 'HUM001',
    name: '湿度传感器',
    manufacturer: 'IoT Corp',
    thingModelId: 2,
    thingModelName: '湿度传感器物模型',
    properties: {
      humidity: { type: 'float', unit: '%', min: 0, max: 100, precision: 1, default: 50, readable: true, writable: false },
    },
    services: ['read_humidity', 'calibrate', 'set_precision', 'reset_calibration'],
    events: ['humidity_alert', 'sensor_fault', 'calibration_complete', 'low_battery'],
    deviceCount: 128,
    createdAt: '2024-01-15 00:00:00',
  },
  {
    id: 3,
    code: 'ENV001',
    name: '环境监测器',
    manufacturer: 'Smart Devices',
    thingModelId: 3,
    thingModelName: '环境监测器物模型',
    properties: {
      temperature: { type: 'float', unit: '°C', min: -40, max: 85, precision: 1, readable: true, writable: false },
      humidity: { type: 'float', unit: '%', min: 0, max: 100, precision: 1, readable: true, writable: false },
      pressure: { type: 'float', unit: 'hPa', min: 800, max: 1200, precision: 1, readable: true, writable: false },
    },
    services: ['read_all', 'calibrate', 'reset', 'set_sampling_rate', 'export_data'],
    events: ['environment_alert', 'sensor_fault', 'data_anomaly', 'calibration_complete', 'low_battery', 'data_exported'],
    deviceCount: 89,
    createdAt: '2024-02-01 00:00:00',
  },
  {
    id: 4,
    code: 'M701001',
    name: '室内空气质量监测器',
    manufacturer: 'Smart Devices',
    thingModelId: 4,
    thingModelName: '室内空气质量监测器物模型',
    properties: {
      co2: { type: 'float', unit: 'ppm', min: 0, max: 5000, precision: 0, readable: true, writable: false },
      hcho: { type: 'float', unit: 'μg/m³', min: 0, max: 1000, precision: 1, readable: true, writable: false },
      tvoc: { type: 'float', unit: 'μg/m³', min: 0, max: 10000, precision: 1, readable: true, writable: false },
      pm25: { type: 'float', unit: 'μg/m³', min: 0, max: 1000, precision: 1, readable: true, writable: false },
      pm10: { type: 'float', unit: 'μg/m³', min: 0, max: 1000, precision: 1, readable: true, writable: false },
      temp: { type: 'float', unit: '°C', min: -40, max: 85, precision: 1, readable: true, writable: false },
      humi: { type: 'float', unit: '%', min: 0, max: 100, precision: 1, readable: true, writable: false },
    },
    services: ['read_all', 'calibrate', 'reset', 'set_alarm_threshold', 'export_data', 'set_sampling_rate'],
    events: ['air_quality_alert', 'sensor_fault', 'data_anomaly', 'calibration_complete', 'low_battery', 'data_exported', 'threshold_exceeded'],
    deviceCount: 45,
    createdAt: '2024-03-01 00:00:00',
  },
];

export default eventHandler(async (event) => {
  const { page = 1, pageSize = 10, name, code, manufacturer, thingModelId } = getQuery(event);
  
  let filtered = MOCK_DEVICE_MODELS;
  
  if (name) {
    filtered = filtered.filter((item) => item.name.includes(name as string));
  }
  if (code) {
    filtered = filtered.filter((item) => item.code.includes(code as string));
  }
  if (manufacturer) {
    filtered = filtered.filter((item) => item.manufacturer?.includes(manufacturer as string));
  }
  if (thingModelId) {
    filtered = filtered.filter((item) => item.thingModelId === Number(thingModelId));
  }
  
  return usePageResponseSuccess(page, pageSize, filtered);
});
