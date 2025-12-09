import { usePageResponseSuccess } from '../../../utils/response';

// Mock 物模型数据（基于新的 device_thing_model 表结构）
const MOCK_THING_MODELS = [
  {
    id: 1,
    name: '温度传感器物模型',
    description: '基础温度传感器功能定义',
    properties: {
      temperature: { type: 'float', unit: '°C', min: -40, max: 85 },
    },
    services: ['read_temperature', 'calibrate'],
    events: ['temperature_alert', 'sensor_fault'],
    deviceCount: 156,
    createdAt: '2024-01-01 00:00:00',
  },
  {
    id: 2,
    name: '湿度传感器物模型',
    description: '基础湿度传感器功能定义',
    properties: {
      humidity: { type: 'float', unit: '%', min: 0, max: 100 },
    },
    services: ['read_humidity', 'calibrate'],
    events: ['humidity_alert', 'sensor_fault'],
    deviceCount: 128,
    createdAt: '2024-01-15 00:00:00',
  },
  {
    id: 3,
    name: '环境监测器物模型',
    description: '多功能环境监测设备功能定义',
    properties: {
      temperature: { type: 'float', unit: '°C' },
      humidity: { type: 'float', unit: '%' },
      pressure: { type: 'float', unit: 'hPa' },
    },
    services: ['read_all', 'calibrate', 'reset'],
    events: ['environment_alert', 'sensor_fault', 'data_anomaly'],
    deviceCount: 89,
    createdAt: '2024-02-01 00:00:00',
  },
  {
    id: 4,
    name: '室内空气质量监测器物模型',
    description: '室内空气质量综合监测设备功能定义',
    properties: {
      co2: { type: 'float', unit: 'ppm', min: 0, max: 5000 },
      hcho: { type: 'float', unit: 'μg/m³', min: 0, max: 1000 },
      tvoc: { type: 'float', unit: 'μg/m³', min: 0, max: 10000 },
      pm25: { type: 'float', unit: 'μg/m³', min: 0, max: 1000 },
      pm10: { type: 'float', unit: 'μg/m³', min: 0, max: 1000 },
      temp: { type: 'float', unit: '°C', min: -40, max: 85 },
      humi: { type: 'float', unit: '%', min: 0, max: 100 },
    },
    services: ['read_all', 'calibrate', 'reset', 'set_alarm_threshold', 'export_data'],
    events: ['air_quality_alert', 'sensor_fault', 'data_anomaly', 'calibration_complete', 'low_battery', 'data_exported'],
    deviceCount: 45,
    createdAt: '2024-03-01 00:00:00',
  },
];

export default eventHandler(async (event) => {
  const { page = 1, pageSize = 10, name } = getQuery(event);
  
  let filtered = MOCK_THING_MODELS;
  
  if (name) {
    filtered = filtered.filter((item) => item.name.includes(name as string));
  }
  
  return usePageResponseSuccess(page, pageSize, filtered);
});
