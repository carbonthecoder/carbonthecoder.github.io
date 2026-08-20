
      const GITHUB_USERNAME = "carbonthecoder";
      let githubRawData = null;
      // Expose globally so setTheme can call it
      window.currentGithubYear = "2026";

      async function fetchGithubYear(year) {
        const url = `https://github.com/users/${GITHUB_USERNAME}/contributions?from=${year}-01-01&to=${year}-12-31`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("GitHub fetch error " + res.status);
        const html = await res.text();
        
        // Parse contribution cells from the HTML
        const contributions = [];
        let total = 0;
        // Match all td elements with data-date and data-level
        const regex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g;
        let match;
        while ((match = regex.exec(html)) !== null) {
          const date = match[1];
          const level = parseInt(match[2]);
          // Extract count from tooltip text nearby
          const countRegex = new RegExp(`${date}[^<]*<\\/td>[\\s\\S]*?>(\\d+|No) contribution`);
          const countMatch = html.match(new RegExp(`for="[^"]*"[^>]*>[^<]*(\\d+|No) contributions? on`));
          // Use level as a proxy since tooltip parsing is fragile
          let count = 0;
          if (level === 1) count = 1;
          else if (level === 2) count = 3;
          else if (level === 3) count = 6;
          else if (level === 4) count = 10;
          contributions.push({ date, count, level });
          total += count;
        }

        // Try to get actual total from the H2 text
        const totalMatch = html.match(/([\d,]+)\s+contributions?\s+in\s+\d{4}/);
        if (totalMatch) total = parseInt(totalMatch[1].replace(/,/g, ""));

        return { contributions, total };
      }

      async function fetchGithubData() {
        try {
          // Fetch both years
          const [data2026, data2025, data2024] = await Promise.all([
            fetchGithubYear("2026"),
            fetchGithubYear("2025"),
            fetchGithubYear("2024")
          ]);

          githubRawData = {
            total: { "2026": data2026.total, "2025": data2025.total, "2024": data2024.total },
            contributions: [...data2026.contributions, ...data2025.contributions, ...data2024.contributions]
          };
        } catch (e) {
          console.warn("GitHub scrape failed, trying jogruber API...", e);
          try {
            const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}`);
            if (!res.ok) throw new Error("API error");
            githubRawData = await res.json();
          } catch (e2) {
            console.warn("All GitHub data sources failed.", e2);
            githubRawData = { total: { "2025": 0, "2026": 0 }, contributions: [] };
          }
        }
        renderGithubHeatmap(window.currentGithubYear);
      }

      window.changeGithubYear = function(year, btnEl) {
        window.currentGithubYear = year;
        document.querySelectorAll(".gh-year-btn").forEach(b => b.classList.remove("active"));
        if (btnEl) btnEl.classList.add("active");
        renderGithubHeatmap(window.currentGithubYear);
      }

      window.renderGithubHeatmap = function(year) {
        if (!githubRawData || !githubRawData.contributions) return;

        const container = document.getElementById("githubCalendarContainer");
        if (!container) return;

        let dataToRender = [];
        let totalCount = 0;

        if (year === "last") {
          const now = new Date();
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(now.getFullYear() - 1);
          dataToRender = githubRawData.contributions.filter(d => {
            const date = new Date(d.date + "T00:00:00");
            return date >= oneYearAgo && date <= now;
          });
          totalCount = githubRawData.total.lastYear || dataToRender.reduce((a, b) => a + b.count, 0);
          const lbl = document.getElementById("githubPeriodLabel");
          if(lbl) lbl.textContent = "the last year";
        } else {
          dataToRender = githubRawData.contributions.filter(d => d.date.startsWith(year));
          totalCount = githubRawData.total[year] || dataToRender.reduce((a, b) => a + b.count, 0);
          const lbl = document.getElementById("githubPeriodLabel");
          if(lbl) lbl.textContent = `in ${year}`;
        }

        const numEl = document.getElementById("githubTotalNum");
        if(numEl) numEl.textContent = totalCount;

        dataToRender.sort((a, b) => new Date(a.date) - new Date(b.date));
        if (dataToRender.length === 0) {
          container.innerHTML = `<div style="padding: 20px; color: rgba(255,255,255,0.4); text-align: center;">No contributions found</div>`;
          return;
        }

        // Read actual accent color (CSS var doesn't work inside SVG fill)
        const accentHex = window.currentAccentHex ||
          getComputedStyle(document.documentElement).getPropertyValue("--accent-color").trim() || "#FF3300";

        const cellSize = 15;
        const cellGap = 3;
        const step = cellSize + cellGap;

        const today = new Date();
        today.setHours(23,59,59,999);

        // Build a map: date string → {count, level}
        const dayMap = {};
        dataToRender.forEach(d => { dayMap[d.date] = d; });

        // Start from the Sunday on or before the first data date
        const firstDate = new Date(dataToRender[0].date + "T00:00:00");
        const startSunday = new Date(firstDate);
        startSunday.setDate(firstDate.getDate() - firstDate.getDay());

        // End at the last data date (Dec 31st of the year) to keep the chart full width
        const lastDate = new Date(dataToRender[dataToRender.length - 1].date + "T00:00:00");
        const endSaturday = new Date(lastDate);
        endSaturday.setDate(lastDate.getDate() + (6 - lastDate.getDay()));

        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

        // Walk week by week
        let weeks = [];
        let cur = new Date(startSunday);
        while (cur <= endSaturday) {
          let week = [];
          for (let dow = 0; dow < 7; dow++) {
            const dateStr = cur.toISOString().slice(0, 10);
            week.push({ date: dateStr, dow, ...(dayMap[dateStr] || { count: 0, level: 0 }) });
            cur.setDate(cur.getDate() + 1);
          }
          weeks.push(week);
        }

        const svgW = weeks.length * step + 40;
        const svgH = 7 * step + 30;

        let svg = `<svg width="${svgW}" height="${svgH}" viewBox="-28 -18 ${svgW + 32} ${svgH + 4}" style="font-family:'JetBrains Mono',monospace;font-size:12px;fill:rgba(255,255,255,0.4); margin: 0 auto; display: inline-block;">`;

        // Day labels
        svg += `<text x="-4" y="${1 * step + 9}" text-anchor="end">Mon</text>`;
        svg += `<text x="-4" y="${3 * step + 9}" text-anchor="end">Wed</text>`;
        svg += `<text x="-4" y="${5 * step + 9}" text-anchor="end">Fri</text>`;

        // Month labels
        let lastLabelMonth = -1;
        weeks.forEach((week, wi) => {
          const firstDay = week.find(d => d.dow === 0) || week[0];
          const d = new Date(firstDay.date + "T00:00:00");
          if (d.getMonth() !== lastLabelMonth) {
            svg += `<text x="${wi * step}" y="-6">${months[d.getMonth()]}</text>`;
            lastLabelMonth = d.getMonth();
          }
        });

        // Cells
        weeks.forEach((week, wi) => {
          week.forEach(day => {
            const x = wi * step;
            const y = day.dow * step;
            let fill, opacity;
            if (day.level === 0) { fill = "#ffffff"; opacity = 0.06; }
            else if (day.level === 1) { fill = accentHex; opacity = 0.30; }
            else if (day.level === 2) { fill = accentHex; opacity = 0.55; }
            else if (day.level === 3) { fill = accentHex; opacity = 0.80; }
            else { fill = accentHex; opacity = 1; }

            const tip = `${day.count} contribution${day.count !== 1 ? "s" : ""} on ${new Date(day.date + "T00:00:00").toDateString()}`;
            svg += `<rect class="gh-cell" x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2" ry="2" fill="${fill}" fill-opacity="${opacity}" data-tooltip="${tip}" onmouseenter="showGhTooltip(event,this)" onmouseleave="hideGhTooltip()"></rect>`;
          });
        });

        svg += `</svg>`;
        container.innerHTML = svg;
      }

      window.showGhTooltip = function(e, el) {
        const tooltip = document.getElementById("ghTooltip");
        if (!tooltip) return;
        tooltip.textContent = el.getAttribute("data-tooltip");
        tooltip.style.display = "block";
        const rect = el.getBoundingClientRect();
        tooltip.style.left = (rect.left + rect.width / 2) + "px";
        tooltip.style.top = (rect.top - 5) + "px";
      }

      window.hideGhTooltip = function() {
        const tooltip = document.getElementById("ghTooltip");
        if (tooltip) tooltip.style.display = "none";
      }

      document.addEventListener("DOMContentLoaded", () => {
        const tt = document.createElement("div");
        tt.id = "ghTooltip";
        document.body.appendChild(tt);
        fetchGithubData();
      });
    