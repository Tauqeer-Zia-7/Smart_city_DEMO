// Smart City IoT Management Platform
class SmartCityDashboard {
    constructor() {
        this.cityData = {
            totalDevices: 2847,
            activeDevices: 2795,
            offlineDevices: 52,
            criticalAlerts: 3,
            warningAlerts: 12,
            networkHealth: 98.2,
            dataUsage: "1.2 TB/day",
            avgLatency: "15ms"
        };

        this.deviceTypes = [
            {type: "traffic_light", count: 450, color: "#FF6B6B", icon: "🚦", name: "Traffic Lights"},
            {type: "air_sensor", count: 180, color: "#4ECDC4", icon: "🌬️", name: "Air Sensors"},
            {type: "parking_meter", count: 890, color: "#45B7D1", icon: "🅿️", name: "Parking Meters"},
            {type: "street_light", count: 1200, color: "#FFA726", icon: "💡", name: "Street Lights"},
            {type: "weather_station", count: 85, color: "#66BB6A", icon: "🌤️", name: "Weather Stations"},
            {type: "security_camera", count: 142, color: "#AB47BC", icon: "📹", name: "Security Cameras"}
        ];

        this.alerts = [
            {id: 1, type: "critical", device: "Traffic Light TL-045", message: "Intersection malfunction detected", time: "2 minutes ago", icon: "🚨"},
            {id: 2, type: "warning", device: "Air Sensor AS-123", message: "PM2.5 levels above normal", time: "5 minutes ago", icon: "⚠️"},
            {id: 3, type: "info", device: "Parking Zone P-078", message: "High occupancy rate detected", time: "8 minutes ago", icon: "ℹ️"}
        ];

        this.analyticsData = {
            deviceUptime: [99.2, 98.8, 99.1, 98.9, 99.3, 98.7, 99.0],
            networkLatency: [12, 15, 18, 14, 16, 13, 15],
            dataVolume: [0.8, 1.1, 1.3, 1.2, 1.4, 1.1, 1.2],
            timeLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        };

        this.devices = [];
        this.activeFilter = 'all';
        this.updateInterval = null;
        this.feedItems = [];
        this.charts = {};

        this.init();
    }

    init() {
        this.generateDevices();
        this.setupEventListeners();
        this.initializeCharts();
        this.updateDisplay();
        this.renderDeviceFilters();
        this.renderCityMap();
        this.renderDataFeed();
        this.renderAlerts();
        this.startRealTimeUpdates();
        this.updateClock();
    }

    generateDevices() {
        this.devices = [];
        let deviceId = 1;

        this.deviceTypes.forEach(type => {
            for (let i = 0; i < type.count; i++) {
                const device = {
                    id: `${type.type}_${String(deviceId).padStart(3, '0')}`,
                    type: type.type,
                    name: `${type.name.slice(0, -1)} ${String(deviceId).padStart(3, '0')}`,
                    icon: type.icon,
                    color: type.color,
                    status: Math.random() > 0.02 ? 'online' : 'offline',
                    location: this.generateLocation(),
                    lastUpdate: new Date(Date.now() - Math.random() * 3600000),
                    battery: type.type.includes('meter') || type.type.includes('sensor') ? Math.floor(Math.random() * 100) : null,
                    data: this.generateDeviceData(type.type)
                };
                this.devices.push(device);
                deviceId++;
            }
        });
    }

    generateLocation() {
        const districts = ['Downtown', 'Business District', 'Residential North', 'Industrial Zone', 'Harbor Area', 'Tech Park'];
        const streets = ['Main St', 'Oak Ave', 'Pine Rd', 'Cedar Blvd', 'Maple Dr', 'Elm St', 'Park Ave', 'River Rd'];
        
        return {
            district: districts[Math.floor(Math.random() * districts.length)],
            address: `${Math.floor(Math.random() * 9999) + 1} ${streets[Math.floor(Math.random() * streets.length)]}`,
            coordinates: {
                x: Math.floor(Math.random() * 12),
                y: Math.floor(Math.random() * 8)
            }
        };
    }

    generateDeviceData(type) {
        switch (type) {
            case 'traffic_light':
                return {
                    currentState: ['green', 'yellow', 'red'][Math.floor(Math.random() * 3)],
                    vehicleCount: Math.floor(Math.random() * 50),
                    cycleTime: Math.floor(Math.random() * 60) + 30
                };
            case 'air_sensor':
                return {
                    pm25: Math.floor(Math.random() * 50) + 10,
                    co2: Math.floor(Math.random() * 200) + 300,
                    temperature: Math.floor(Math.random() * 30) + 15,
                    humidity: Math.floor(Math.random() * 40) + 40
                };
            case 'parking_meter':
                return {
                    occupied: Math.random() > 0.4,
                    paymentStatus: Math.random() > 0.2 ? 'paid' : 'expired',
                    revenue: Math.floor(Math.random() * 50)
                };
            case 'street_light':
                return {
                    brightness: Math.floor(Math.random() * 100),
                    energyUsage: Math.floor(Math.random() * 50) + 20,
                    operationalHours: Math.floor(Math.random() * 12) + 6
                };
            case 'weather_station':
                return {
                    temperature: Math.floor(Math.random() * 25) + 10,
                    humidity: Math.floor(Math.random() * 40) + 40,
                    windSpeed: Math.floor(Math.random() * 20) + 5,
                    pressure: Math.floor(Math.random() * 100) + 950
                };
            case 'security_camera':
                return {
                    recording: Math.random() > 0.1,
                    alertsTriggered: Math.floor(Math.random() * 10),
                    storageUsed: Math.floor(Math.random() * 80) + 10
                };
            default:
                return {};
        }
    }

    setupEventListeners() {
        // Device filter buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.filter-btn')) {
                this.handleFilterClick(e.target.dataset.type);
            }
        });

        // Map refresh button
        document.getElementById('refreshMap')?.addEventListener('click', () => {
            this.renderCityMap();
            this.showNotification('Map refreshed', 'info');
        });

        // Clear alerts button
        document.getElementById('clearAlerts')?.addEventListener('click', () => {
            this.clearAlerts();
        });

        // Analytics range selector
        document.getElementById('analyticsRange')?.addEventListener('change', (e) => {
            this.updateAnalytics(e.target.value);
        });

        // Modal close events
        document.getElementById('modalClose')?.addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('modalBackdrop')?.addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('modalCloseBtn')?.addEventListener('click', () => {
            this.closeModal();
        });

        // Device marker clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.device-marker')) {
                this.showDeviceDetails(e.target.dataset.deviceId);
            }
        });
    }

    initializeCharts() {
        // Device Uptime Chart
        const uptimeCtx = document.getElementById('uptimeChart')?.getContext('2d');
        if (uptimeCtx) {
            this.charts.uptime = new Chart(uptimeCtx, {
                type: 'line',
                data: {
                    labels: this.analyticsData.timeLabels,
                    datasets: [{
                        label: 'Device Uptime (%)',
                        data: this.analyticsData.deviceUptime,
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: 95,
                            max: 100,
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        }
                    }
                }
            });
        }

        // Network Latency Chart
        const latencyCtx = document.getElementById('latencyChart')?.getContext('2d');
        if (latencyCtx) {
            this.charts.latency = new Chart(latencyCtx, {
                type: 'bar',
                data: {
                    labels: this.analyticsData.timeLabels,
                    datasets: [{
                        label: 'Network Latency (ms)',
                        data: this.analyticsData.networkLatency,
                        backgroundColor: '#FFC185',
                        borderColor: '#FFB74D',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return value + 'ms';
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    updateDisplay() {
        // Update overview cards
        document.getElementById('activeDevices').textContent = this.cityData.activeDevices.toLocaleString();
        document.getElementById('totalDevices').textContent = this.cityData.totalDevices.toLocaleString();
        document.getElementById('criticalAlerts').textContent = this.cityData.criticalAlerts;
        document.getElementById('warningAlerts').textContent = this.cityData.warningAlerts;
        document.getElementById('dataUsage').textContent = this.cityData.dataUsage.split('/')[0];
        document.getElementById('avgLatency').textContent = this.cityData.avgLatency;
        document.getElementById('networkHealth').textContent = this.cityData.networkHealth + '%';
        
        // Update footer
        document.getElementById('footerDeviceCount').textContent = this.cityData.totalDevices.toLocaleString();
    }

    renderDeviceFilters() {
        const filtersContainer = document.getElementById('deviceFilters');
        if (!filtersContainer) return;

        filtersContainer.innerHTML = '';

        // All devices button
        const allButton = document.createElement('button');
        allButton.className = 'filter-btn filter-btn--active';
        allButton.dataset.type = 'all';
        allButton.innerHTML = `
            <span class="filter-count">${this.cityData.totalDevices.toLocaleString()}</span>
            <span class="filter-label">All Devices</span>
        `;
        filtersContainer.appendChild(allButton);

        // Device type buttons
        this.deviceTypes.forEach(type => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.dataset.type = type.type;
            button.innerHTML = `
                <span class="filter-count">${type.count}</span>
                <span class="filter-label">${type.icon} ${type.name}</span>
            `;
            filtersContainer.appendChild(button);
        });
    }

    renderCityMap() {
        const mapContainer = document.getElementById('cityMap');
        if (!mapContainer) return;

        mapContainer.innerHTML = '';

        // Create device markers based on current filter
        const filteredDevices = this.activeFilter === 'all' 
            ? this.devices 
            : this.devices.filter(device => device.type === this.activeFilter);

        // Distribute devices across the grid
        filteredDevices.forEach((device, index) => {
            if (index > 96) return; // Limit to grid size

            const marker = document.createElement('div');
            marker.className = 'device-marker';
            marker.style.backgroundColor = device.color;
            marker.style.gridColumn = device.location.coordinates.x + 1;
            marker.style.gridRow = device.location.coordinates.y + 1;
            marker.dataset.deviceId = device.id;
            marker.dataset.tooltip = `${device.name} - ${device.status}`;
            marker.textContent = device.icon;
            
            if (device.status === 'offline') {
                marker.style.opacity = '0.4';
                marker.style.filter = 'grayscale(100%)';
            }

            mapContainer.appendChild(marker);
        });
    }

    renderDataFeed() {
        const feedContainer = document.getElementById('dataFeed');
        if (!feedContainer) return;

        // Generate initial feed items
        this.generateFeedItems();

        feedContainer.innerHTML = '';
        this.feedItems.slice(0, 20).forEach(item => {
            const feedItem = document.createElement('div');
            feedItem.className = 'feed-item';
            feedItem.innerHTML = `
                <div class="feed-item__icon">${item.icon}</div>
                <div class="feed-item__content">
                    <div class="feed-item__device">${item.device}</div>
                    <div class="feed-item__message">${item.message}</div>
                </div>
                <div class="feed-item__time">${item.time}</div>
            `;
            feedContainer.appendChild(feedItem);
        });
    }

    generateFeedItems() {
        const messages = [
            'Status update received',
            'Data transmission successful',
            'Battery level updated',
            'Configuration changed',
            'Alert threshold exceeded',
            'Maintenance required',
            'Performance metrics updated',
            'Connection restored',
            'Scheduled task completed',
            'Sensor calibration performed'
        ];

        for (let i = 0; i < 50; i++) {
            const device = this.devices[Math.floor(Math.random() * this.devices.length)];
            const message = messages[Math.floor(Math.random() * messages.length)];
            const timeAgo = Math.floor(Math.random() * 30) + 1;
            
            this.feedItems.push({
                id: Date.now() + i,
                device: device.name,
                message: message,
                time: `${timeAgo}s ago`,
                timestamp: Date.now() - (timeAgo * 1000),
                icon: device.icon
            });
        }

        // Sort by timestamp
        this.feedItems.sort((a, b) => b.timestamp - a.timestamp);
    }

    renderAlerts() {
        const alertsContainer = document.getElementById('alertsList');
        if (!alertsContainer) return;

        alertsContainer.innerHTML = '';
        
        this.alerts.forEach(alert => {
            const alertItem = document.createElement('div');
            alertItem.className = `alert-item alert-item--${alert.type}`;
            alertItem.innerHTML = `
                <div class="alert-icon">${alert.icon}</div>
                <div class="alert-content">
                    <div class="alert-device">${alert.device}</div>
                    <div class="alert-message">${alert.message}</div>
                    <div class="alert-time">${alert.time}</div>
                </div>
            `;
            alertsContainer.appendChild(alertItem);
        });
    }

    handleFilterClick(filterType) {
        // Update active filter
        this.activeFilter = filterType;

        // Update button states
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('filter-btn--active');
        });
        document.querySelector(`[data-type="${filterType}"]`).classList.add('filter-btn--active');

        // Re-render map
        this.renderCityMap();
    }

    showDeviceDetails(deviceId) {
        const device = this.devices.find(d => d.id === deviceId);
        if (!device) return;

        const modal = document.getElementById('deviceModal');
        const title = document.getElementById('modalDeviceTitle');
        const body = document.getElementById('modalDeviceBody');

        title.textContent = device.name;
        
        body.innerHTML = `
            <div class="device-details">
                <div class="device-header">
                    <span class="device-icon" style="font-size: 2rem;">${device.icon}</span>
                    <div class="device-status">
                        <span class="status status--${device.status === 'online' ? 'success' : 'error'}">
                            ${device.status.toUpperCase()}
                        </span>
                    </div>
                </div>
                <div class="device-info">
                    <h4>Location</h4>
                    <p>${device.location.address}, ${device.location.district}</p>
                    
                    <h4>Device Information</h4>
                    <p><strong>Device ID:</strong> ${device.id}</p>
                    <p><strong>Type:</strong> ${device.type.replace('_', ' ').toUpperCase()}</p>
                    <p><strong>Last Update:</strong> ${device.lastUpdate.toLocaleString()}</p>
                    ${device.battery ? `<p><strong>Battery:</strong> ${device.battery}%</p>` : ''}
                    
                    <h4>Current Data</h4>
                    <div class="device-data">
                        ${this.formatDeviceData(device.data, device.type)}
                    </div>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
    }

    formatDeviceData(data, type) {
        let html = '';
        Object.entries(data).forEach(([key, value]) => {
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            html += `<p><strong>${label}:</strong> ${value}</p>`;
        });
        return html;
    }

    closeModal() {
        document.getElementById('deviceModal').classList.add('hidden');
    }

    clearAlerts() {
        this.alerts = this.alerts.filter(alert => alert.type !== 'info');
        this.cityData.warningAlerts = Math.max(0, this.cityData.warningAlerts - 1);
        this.renderAlerts();
        this.updateDisplay();
        this.showNotification('Alerts cleared', 'success');
    }

    updateAnalytics(range) {
        // Simulate different data for different ranges
        let multiplier = 1;
        switch(range) {
            case '30d': multiplier = 0.98; break;
            case '90d': multiplier = 0.95; break;
        }

        const newUptimeData = this.analyticsData.deviceUptime.map(val => val * multiplier);
        const newLatencyData = this.analyticsData.networkLatency.map(val => Math.round(val / multiplier));

        this.charts.uptime.data.datasets[0].data = newUptimeData;
        this.charts.latency.data.datasets[0].data = newLatencyData;

        this.charts.uptime.update();
        this.charts.latency.update();
    }

    startRealTimeUpdates() {
        this.updateInterval = setInterval(() => {
            this.simulateRealTimeData();
        }, 3000);
    }

    simulateRealTimeData() {
        // Update network health
        this.cityData.networkHealth += (Math.random() - 0.5) * 0.5;
        this.cityData.networkHealth = Math.max(95, Math.min(100, this.cityData.networkHealth));

        // Update active devices
        const change = Math.floor((Math.random() - 0.5) * 10);
        this.cityData.activeDevices = Math.max(2700, Math.min(2847, this.cityData.activeDevices + change));
        this.cityData.offlineDevices = this.cityData.totalDevices - this.cityData.activeDevices;

        // Occasionally generate new alerts
        if (Math.random() < 0.1) {
            this.generateRandomAlert();
        }

        // Add new feed item
        this.addRandomFeedItem();

        // Update displays
        this.updateDisplay();
        this.renderDataFeed();
        
        // Add update animation
        document.querySelectorAll('.overview-card').forEach(card => {
            card.classList.add('data-update');
            setTimeout(() => card.classList.remove('data-update'), 400);
        });
    }

    generateRandomAlert() {
        const alertTypes = ['warning', 'info'];
        const devices = this.devices.slice(0, 20);
        const messages = [
            'High traffic detected',
            'Unusual sensor readings',
            'Maintenance window approaching',
            'Battery level low',
            'Performance degradation detected',
            'Connection intermittent'
        ];

        const device = devices[Math.floor(Math.random() * devices.length)];
        const message = messages[Math.floor(Math.random() * messages.length)];
        const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];

        const newAlert = {
            id: Date.now(),
            type: type,
            device: device.name,
            message: message,
            time: 'Just now',
            icon: type === 'warning' ? '⚠️' : 'ℹ️'
        };

        this.alerts.unshift(newAlert);
        this.alerts = this.alerts.slice(0, 10); // Keep only latest 10

        if (type === 'warning') {
            this.cityData.warningAlerts++;
        }

        this.renderAlerts();
    }

    addRandomFeedItem() {
        const device = this.devices[Math.floor(Math.random() * this.devices.length)];
        const messages = [
            'Data packet received',
            'Heartbeat signal',
            'Status check complete',
            'Sensor reading updated',
            'System health verified'
        ];

        const newItem = {
            id: Date.now(),
            device: device.name,
            message: messages[Math.floor(Math.random() * messages.length)],
            time: 'Just now',
            timestamp: Date.now(),
            icon: device.icon
        };

        this.feedItems.unshift(newItem);
        this.feedItems = this.feedItems.slice(0, 50); // Keep only latest 50
    }

    updateClock() {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            document.getElementById('currentTime').textContent = timeString;
        };

        updateTime();
        setInterval(updateTime, 1000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `status status--${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 1001;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Error handling
window.addEventListener('error', (event) => {
    console.error('Smart City Dashboard Error:', event.error);
});

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    try {
        const dashboard = new SmartCityDashboard();
        window.smartCityDashboard = dashboard;
        console.log('Smart City IoT Dashboard initialized successfully');
    } catch (error) {
        console.error('Failed to initialize dashboard:', error);
    }
});

// Handle visibility changes
document.addEventListener('visibilitychange', () => {
    if (window.smartCityDashboard) {
        if (document.hidden) {
            clearInterval(window.smartCityDashboard.updateInterval);
        } else {
            window.smartCityDashboard.startRealTimeUpdates();
        }
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.smartCityDashboard && window.smartCityDashboard.charts) {
        Object.values(window.smartCityDashboard.charts).forEach(chart => {
            if (chart) chart.resize();
        });
    }
});