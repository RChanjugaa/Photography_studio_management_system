// Document template utility for generating professional reports
export const generateClientReportHTML = (data: any) => {
  const { client, bookings, payments, bookingStats, paymentStats, generatedAt } = data;
  const stats = bookingStats[0] || {};
  const payStats = paymentStats[0] || {};
  const reportDate = new Date(generatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Client Report - ${client.first_name} ${client.last_name}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Georgia, serif; color: #1a1a1a; background: white; }
        
        .page { 
          width: 210mm; 
          min-height: 297mm; 
          padding: 0;
          margin: 0 auto;
          position: relative;
        }

        /* Header wave - top */
        .header {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #c9a84c 100%);
          padding: 30px 50px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          clip-path: ellipse(100% 100% at 50% 0%);
          padding-bottom: 50px;
        }

        .logo-section { color: white; }
        .logo-text { 
          font-size: 36px; 
          font-style: italic; 
          color: #c9a84c;
          font-family: 'Palatino Linotype', Georgia, serif;
        }
        .tagline { 
          font-size: 11px; 
          color: #d4b896; 
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-top: 4px;
        }

        .contact-section { text-align: right; color: white; font-size: 11px; }
        .contact-section p { margin: 3px 0; color: #d4d4d4; }

        /* Content */
        .content { padding: 40px 50px; }

        .confirmation-title {
          text-align: center;
          font-size: 22px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #1a1a1a;
          border-bottom: 2px solid #c9a84c;
          border-top: 2px solid #c9a84c;
          padding: 12px 0;
          margin-bottom: 35px;
        }

        .bill-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          font-size: 12px;
          flex-wrap: wrap;
          gap: 15px;
        }
        .bill-meta div { color: #555; }
        .bill-meta strong { color: #1a1a1a; }

        .section {
          margin-bottom: 25px;
          border: 1px solid #e8e0d0;
          border-radius: 4px;
          overflow: hidden;
          page-break-inside: avoid;
        }
        .section-header {
          background: linear-gradient(90deg, #1a1a1a, #2d2d2d);
          color: #c9a84c;
          padding: 10px 20px;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .section-body { padding: 20px; }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        .grid-4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
        }
        .field label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #888;
          display: block;
          margin-bottom: 4px;
        }
        .field span {
          font-size: 13px;
          color: #1a1a1a;
          font-weight: 600;
        }

        .stat-box {
          background: #fafaf8;
          border: 1px solid #e8e0d0;
          border-radius: 4px;
          padding: 15px 20px;
          text-align: center;
        }
        .stat-box .label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #888;
          margin-bottom: 8px;
          display: block;
        }
        .stat-box .value {
          font-size: 22px;
          color: #c9a84c;
          font-weight: bold;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        table th {
          background: #f0f0f0;
          padding: 12px;
          text-align: left;
          font-weight: bold;
          border-bottom: 2px solid #c9a84c;
          color: #333;
          font-size: 11px;
          letter-spacing: 1px;
        }
        table td {
          padding: 12px;
          border-bottom: 1px solid #e0e0e0;
          font-size: 12px;
        }
        table tr:hover { background: #f9f9f9; }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .status-completed { background: #d4edda; color: #155724; }
        .status-pending { background: #fff3cd; color: #856404; }
        .status-cancelled { background: #f8d7da; color: #721c24; }

        .amount {
          font-weight: bold;
          color: #c9a84c;
        }

        .no-data {
          color: #999;
          font-style: italic;
          padding: 15px;
          text-align: center;
        }

        /* Footer wave */
        .footer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #c9a84c 0%, #2d2d2d 50%, #1a1a1a 100%);
          padding: 20px 50px;
          clip-path: ellipse(100% 100% at 50% 100%);
          padding-top: 40px;
          text-align: center;
        }
        .footer-links { display: flex; justify-content: center; gap: 40px; }
        .footer-links span { color: #d4b896; font-size: 11px; }

        .thank-you {
          text-align: center;
          color: #888;
          font-size: 12px;
          font-style: italic;
          margin-bottom: 20px;
        }

        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .page { width: 100%; }
          .section { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="page">
        <!-- Header -->
        <div class="header">
          <div class="logo-section">
            <div class="logo-text">Ambiance</div>
            <div class="tagline">Capturing Timeless Moments</div>
          </div>
          <div class="contact-section">
            <p>7, 2 Charlemont Rd, Colombo</p>
            <p>+94779774518</p>
            <p>www.ambiance.lk</p>
          </div>
        </div>

        <!-- Content -->
        <div class="content">
          <div class="confirmation-title">Client Report</div>

          <!-- Report meta -->
          <div class="bill-meta">
            <div><strong>Generated:</strong> ${reportDate}</div>
            <div><strong>Client ID:</strong> ${client.id}</div>
            <div><strong>Report ID:</strong> CLR-${client.id}-${new Date(generatedAt).getTime()}</div>
          </div>

          <!-- Client Info Section -->
          <div class="section">
            <div class="section-header">Client Information</div>
            <div class="section-body">
              <div class="grid-2">
                <div class="field">
                  <label>Full Name</label>
                  <span>${client.first_name} ${client.last_name}</span>
                </div>
                <div class="field">
                  <label>Email</label>
                  <span>${client.email}</span>
                </div>
                <div class="field">
                  <label>Phone</label>
                  <span>${client.phone || 'N/A'}</span>
                </div>
                <div class="field">
                  <label>Status</label>
                  <span>${client.status}</span>
                </div>
                <div class="field">
                  <label>Registration Date</label>
                  <span>${new Date(client.registration_date).toLocaleDateString()}</span>
                </div>
                <div class="field">
                  <label>Last Login</label>
                  <span>${client.last_login ? new Date(client.last_login).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Booking Statistics Section -->
          <div class="section">
            <div class="section-header">Booking Summary</div>
            <div class="section-body">
              <div class="grid-4">
                <div class="stat-box">
                  <span class="label">Total Bookings</span>
                  <div class="value">${stats.total_bookings || 0}</div>
                </div>
                <div class="stat-box">
                  <span class="label">Completed</span>
                  <div class="value">${stats.completed_bookings || 0}</div>
                </div>
                <div class="stat-box">
                  <span class="label">Pending</span>
                  <div class="value">${stats.pending_bookings || 0}</div>
                </div>
                <div class="stat-box">
                  <span class="label">Total Value</span>
                  <div class="value">LKR ${(stats.total_booking_value || 0).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Statistics Section -->
          <div class="section">
            <div class="section-header">Payment Summary</div>
            <div class="section-body">
              <div class="grid-4">
                <div class="stat-box">
                  <span class="label">Total Payments</span>
                  <div class="value">${payStats.total_payments || 0}</div>
                </div>
                <div class="stat-box">
                  <span class="label">Completed</span>
                  <div class="value">${payStats.completed_payments || 0}</div>
                </div>
                <div class="stat-box">
                  <span class="label">Pending</span>
                  <div class="value">${payStats.pending_payments || 0}</div>
                </div>
                <div class="stat-box">
                  <span class="label">Total Paid</span>
                  <div class="value">LKR ${(payStats.total_paid || 0).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bookings Table -->
          <div class="section">
            <div class="section-header">Booking History</div>
            <div class="section-body">
              ${bookings && bookings.length > 0 ? `
                <table>
                  <thead>
                    <tr>
                      <th>Booking #</th>
                      <th>Service Type</th>
                      <th>Event Date</th>
                      <th>Status</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${bookings.map((b: any) => `
                      <tr>
                        <td>${b.booking_number}</td>
                        <td>${b.service_type}</td>
                        <td>${new Date(b.event_date).toLocaleDateString()}</td>
                        <td>
                          <span class="status-badge status-${b.status}">
                            ${b.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td class="amount">LKR ${(b.amount || 0).toLocaleString()}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              ` : '<div class="no-data">No bookings found</div>'}
            </div>
          </div>

          <!-- Payments Table -->
          <div class="section">
            <div class="section-header">Payment History</div>
            <div class="section-body">
              ${payments && payments.length > 0 ? `
                <table>
                  <thead>
                    <tr>
                      <th>Payment ID</th>
                      <th>Booking #</th>
                      <th>Payment Date</th>
                      <th>Status</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${payments.map((p: any) => `
                      <tr>
                        <td>${p.id}</td>
                        <td>${p.booking_number || 'N/A'}</td>
                        <td>${new Date(p.payment_date).toLocaleDateString()}</td>
                        <td>
                          <span class="status-badge status-${p.status}">
                            ${p.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td class="amount">LKR ${(p.amount || 0).toLocaleString()}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              ` : '<div class="no-data">No payments found</div>'}
            </div>
          </div>

          <div class="thank-you">
            Thank you for choosing Ambiance. We look forward to serving you again.
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="footer-links">
            <span>ambiance.lk</span>
            <span>www.ambiance.lk</span>
            <span>studioambiance.lk</span>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};
