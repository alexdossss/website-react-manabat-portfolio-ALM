import React, { useState, useEffect, useMemo } from 'react';
import { ActivityCalendar } from 'react-activity-calendar';
import '../styles/github-calendar.css';

const CalendarSkeleton = () => (
  <div className="gh-calendar-skeleton">
    {Array.from({ length: 53 }).map((_, col) => (
      <div key={col} className="gh-skeleton-col">
        {Array.from({ length: 7 }).map((__, row) => (
          <div key={row} className="gh-skeleton-cell" />
        ))}
      </div>
    ))}
  </div>
);

const GithubContributions = () => {
  const [selectedYear, setSelectedYear] = useState(2026);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const years = [2026, 2025, 2024];

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    fetch(`https://github-contributions-api.jogruber.de/v4/alexdossss?y=${selectedYear}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch contribution data');
        return res.json();
      })
      .then((fetchedData) => {
        if (active) {
          setData(fetchedData);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [selectedYear]);

  const totalContributions = useMemo(() => {
    if (!data || !data.total) return 0;
    return data.total[selectedYear] || 0;
  }, [data, selectedYear]);

  const theme = {
    dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
  };

  return (
    <div className="gh-contrib-section-wrapper">
      <div className="gh-calendar-card">
        <div className="gh-calendar-header">
          <span className="gh-header-title">
            {loading ? '...' : totalContributions} contributions in {selectedYear}
          </span>
          <button className="gh-header-settings">
            Contribution settings
            <span style={{ fontSize: '10px', marginLeft: '4px' }}>▼</span>
          </button>
        </div>

        <div className="gh-calendar-wrapper">
          {loading ? (
            <CalendarSkeleton />
          ) : error ? (
            <div style={{ color: 'rgba(255, 255, 255, 0.6)', padding: '20px 0' }}>{error}</div>
          ) : (
            <ActivityCalendar
              data={data.contributions}
              theme={theme}
              colorScheme="dark"
              blockSize={13}
              blockMargin={4}
              fontSize={12}
              showWeekdayLabels={true}
              showColorLegend={false}
              showTotalCount={false}
              style={{ width: '100%' }}
            />
          )}
        </div>

        <div className="gh-calendar-footer">
          <a
            href="https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-graphs-on-your-profile/managing-contribution-settings-on-your-profile"
            target="_blank"
            rel="noopener noreferrer"
            className="gh-footer-link"
          >
            Learn how we count contributions
          </a>
          <div className="gh-legend">
            <span>Less</span>
            <div className="gh-legend-cells">
              <div className="gh-legend-cell level-0" />
              <div className="gh-legend-cell level-1" />
              <div className="gh-legend-cell level-2" />
              <div className="gh-legend-cell level-3" />
              <div className="gh-legend-cell level-4" />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>

      <div className="gh-years-list">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`gh-year-btn ${selectedYear === year ? 'active' : ''}`}
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  );
};

export default React.memo(GithubContributions);
