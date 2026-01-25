import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, FileText, Table, Calendar,
  TrendingUp, Users, DollarSign, Filter,
  CheckCircle
} from 'lucide-react';
import './ReportExport.css';

const ReportExport = () => {
  const [reportType, setReportType] = useState('events');
  const [dateRange, setDateRange] = useState('month');
  const [format, setFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const reportTypes = [
    { id: 'events', name: 'Events Report', icon: Calendar, description: 'All events data with bookings' },
    { id: 'revenue', name: 'Revenue Report', icon: DollarSign, description: 'Financial summary and transactions' },
    { id: 'users', name: 'Users Report', icon: Users, description: 'User registrations and activity' },
    { id: 'analytics', name: 'Analytics Report', icon: TrendingUp, description: 'Platform performance metrics' }
  ];

  const dateRanges = [
    { id: 'week', name: 'Last 7 Days' },
    { id: 'month', name: 'Last 30 Days' },
    { id: 'quarter', name: 'Last 3 Months' },
    { id: 'year', name: 'Last Year' },
    { id: 'custom', name: 'Custom Range' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportSuccess(false);

    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock data
    const reportData = generateReportData();
    
    if (format === 'pdf') {
      downloadPDF(reportData);
    } else {
      downloadExcel(reportData);
    }

    setIsExporting(false);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const generateReportData = () => {
    // Mock data generation
    return {
      reportType,
      dateRange,
      generatedAt: new Date().toISOString(),
      data: {
        totalEvents: 156,
        totalRevenue: 45678,
        totalUsers: 2345,
        avgBookingsPerEvent: 23
      }
    };
  };

  const downloadPDF = (data) => {
    // Mock PDF download
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planngo-${reportType}-report-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadExcel = (data) => {
    // Mock Excel download
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planngo-${reportType}-report-${Date.now()}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="report-export">
      <div className="export-header">
        <h2>Export Reports</h2>
        <p>Generate and download comprehensive reports</p>
      </div>

      <div className="export-container">
        {/* Report Type Selection */}
        <div className="export-section">
          <h3>Select Report Type</h3>
          <div className="report-types">
            {reportTypes.map((type) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={type.id}
                  className={`report-type-card ${reportType === type.id ? 'selected' : ''}`}
                  onClick={() => setReportType(type.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="report-icon">
                    <Icon size={24} />
                  </div>
                  <h4>{type.name}</h4>
                  <p>{type.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Date Range Selection */}
        <div className="export-section">
          <h3>Date Range</h3>
          <div className="date-range-selector">
            {dateRanges.map((range) => (
              <motion.button
                key={range.id}
                className={`date-range-btn ${dateRange === range.id ? 'active' : ''}`}
                onClick={() => setDateRange(range.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {range.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Format Selection */}
        <div className="export-section">
          <h3>Export Format</h3>
          <div className="format-selector">
            <motion.button
              className={`format-btn ${format === 'pdf' ? 'active' : ''}`}
              onClick={() => setFormat('pdf')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FileText size={24} />
              <span>PDF</span>
            </motion.button>
            <motion.button
              className={`format-btn ${format === 'excel' ? 'active' : ''}`}
              onClick={() => setFormat('excel')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Table size={24} />
              <span>Excel</span>
            </motion.button>
          </div>
        </div>

        {/* Export Summary */}
        <div className="export-summary">
          <h3>Export Summary</h3>
          <div className="summary-details">
            <div className="summary-item">
              <span>Report Type:</span>
              <strong>{reportTypes.find(t => t.id === reportType)?.name}</strong>
            </div>
            <div className="summary-item">
              <span>Date Range:</span>
              <strong>{dateRanges.find(d => d.id === dateRange)?.name}</strong>
            </div>
            <div className="summary-item">
              <span>Format:</span>
              <strong>{format.toUpperCase()}</strong>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <motion.button
          className="export-btn"
          onClick={handleExport}
          disabled={isExporting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isExporting ? (
            <>
              <div className="spinner" />
              <span>Generating Report...</span>
            </>
          ) : exportSuccess ? (
            <>
              <CheckCircle size={20} />
              <span>Report Downloaded!</span>
            </>
          ) : (
            <>
              <Download size={20} />
              <span>Export Report</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default ReportExport;