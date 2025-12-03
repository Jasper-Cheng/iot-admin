import { usePageResponseSuccess } from '../../../utils/response';

// Mock 网络信息数据
const MOCK_NETWORK_INFO = [
  {
    id: 1,
    deviceId: 1,
    deviceSn: 'DEV-2024-001',
    deviceName: '智能温控器A',
    type: 'wifi',
    ssid: 'Home_WiFi_5G',
    mac: 'AA:BB:CC:DD:EE:01',
    ip: '192.168.1.101',
    rssi: -45,
    signalStrength: 'excellent',
    lastConnectedAt: '2024-12-03 10:30:00',
  },
  {
    id: 2,
    deviceId: 2,
    deviceSn: 'DEV-2024-002',
    deviceName: '智能灯泡B',
    type: 'wifi',
    ssid: 'Home_WiFi_2.4G',
    mac: 'AA:BB:CC:DD:EE:02',
    ip: '192.168.1.102',
    rssi: -65,
    signalStrength: 'good',
    lastConnectedAt: '2024-12-02 18:00:00',
  },
  {
    id: 3,
    deviceId: 3,
    deviceSn: 'DEV-2024-003',
    deviceName: '智能插座C',
    type: 'wifi',
    ssid: 'Home_WiFi_5G',
    mac: 'AA:BB:CC:DD:EE:03',
    ip: '192.168.1.103',
    rssi: -50,
    signalStrength: 'excellent',
    lastConnectedAt: '2024-12-03 11:00:00',
  },
  {
    id: 4,
    deviceId: 4,
    deviceSn: 'DEV-2024-004',
    deviceName: '智能门锁D',
    type: 'ble',
    ssid: null,
    mac: 'AA:BB:CC:DD:EE:04',
    ip: null,
    rssi: -60,
    signalStrength: 'good',
    lastConnectedAt: '2024-12-03 09:45:00',
  },
  {
    id: 5,
    deviceId: 5,
    deviceSn: 'DEV-2024-005',
    deviceName: '智能空调E',
    type: 'wifi',
    ssid: 'Office_WiFi',
    mac: 'AA:BB:CC:DD:EE:05',
    ip: '192.168.2.105',
    rssi: -75,
    signalStrength: 'weak',
    lastConnectedAt: '2024-12-01 08:00:00',
  },
];

export default eventHandler(async (event) => {
  const { page = 1, pageSize = 10 } = getQuery(event);
  return usePageResponseSuccess(page, pageSize, MOCK_NETWORK_INFO);
});
