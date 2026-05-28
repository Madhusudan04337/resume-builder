(function() {
  window.templates = window.templates || {};
  window.templates.sabrina = function(S, SOCIAL_DEFS) {
    var P = S.personal, E = S.education, C = S.coursework, X = S.experience, Pr = S.projects, Sk = S.skills, L = S.leadership, Ct = S.certifications;
    
    // Luxury gold accent color requested by user
    var brandColor = S.accentColor || "#c8986b";
    
    var st = { 
      font: "'Garamond', 'Georgia', serif", 
      sectionLine: "1px solid #cbd5e1", // Thin light gray divider
      bg: "#ffffff", 
      col: "#2d3748", // Charcoal primary text
      brand: brandColor 
    };
    
    var esc = window.RT.esc, linkify = window.RT.linkify, dr = window.RT.dr;
    
    // Mathematically perfect circular bullet list renderer with 15px indentation
    var renderBullets = function(bullets) {
      if (!bullets || !bullets.length) return '';
      var html = '<ul style="margin: 2px 0 4px 0; padding-left: 15px; list-style-type: disc; font-size: 10px; color: #2d3748">';
      bullets.forEach(function(b) {
        html += '<li style="margin-bottom: 2px; text-align: justify; line-height: 1.5">' + esc(b) + '</li>';
      });
      html += '</ul>';
      return html;
    };
    
    // Elegant uppercase section title in gold/bronze with thin light gray divider underneath
    var sh = function(label) {
      var displayLabel = label;
      if (label === "Education") displayLabel = "EDUCATION";
      else if (label === "Coursework") displayLabel = "RELEVANT COURSEWORK";
      else if (label === "Experience") displayLabel = "WORK EXPERIENCE";
      else if (label === "Projects") displayLabel = "TECHNICAL PROJECTS";
      else if (label === "Skills") displayLabel = "SKILLS & HOBBIES";
      else if (label === "Languages") displayLabel = "LANGUAGES";
      else if (label === "Certifications") displayLabel = "CERTIFICATIONS";
      else if (label === "Leadership") displayLabel = "PERSONAL PROFILE / LEADERSHIP";
      
      return '<div style="font-size:12px;font-weight:700;color:' + st.brand + ';margin-top:14px;margin-bottom:3px;letter-spacing:1px;text-transform:uppercase">' + esc(displayLabel) + '</div>' +
             '<div style="border-bottom: ' + st.sectionLine + '; margin-top: 0px; margin-bottom: 8px"></div>';
    };

    var h = '<div style="font-family:' + st.font + ';color:' + st.col + ';line-height:1.5;font-size:10.5px;text-align:left">';
    
    // Header block
    h += '<div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:8px">';
    
    // Candidate details
    h += '  <div style="flex:1">';
    h += '    <div class="rn" style="font-size:26px;font-weight:700;color:' + st.brand + ';letter-spacing:-0.5px;line-height:1.1;text-transform:uppercase">' + esc(P.firstName) + (P.lastName ? ' ' + esc(P.lastName) : '') + '</div>';
    if (S.headline) {
      h += '    <div style="font-size:12px;font-weight:500;color:#4a5568;margin-top:3px;text-transform:none;font-style:italic">' + esc(S.headline) + '</div>';
    }
    h += '  </div>';
    
    // Contact list stacked on right
    var contactItems = [];
    if (P.address) contactItems.push('<span>' + esc(P.address) + ' 📍</span>');
    if (P.phone && S.socialEnabled.phone) contactItems.push('<span>' + esc(P.phone) + ' ☎</span>');
    if (P.email && S.socialEnabled.email) {
      contactItems.push('<span><a href="mailto:' + esc(P.email) + '" style="color:inherit;text-decoration:none">' + esc(P.email) + '</a> @</span>');
    }
    if (P.linkedin && S.socialEnabled.linkedin) {
      contactItems.push('<span><a href="' + (P.linkedin.startsWith('http') ? P.linkedin : 'https://linkedin.com/in/' + P.linkedin) + '" target="_blank" style="color:inherit;text-decoration:none">' + esc(P.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')) + '</a> <b>in</b></span>');
    }
    
    h += '  <div style="font-size:9.5px;color:#4a5568;text-align:right;display:flex;flex-direction:column;gap:2px">';
    contactItems.forEach(function(item) {
      h += '    <div>' + item + '</div>';
    });
    h += '  </div>';
    
    h += '</div>'; // End Header block
    
    // Full width divider line below header
    h += '<div style="border-bottom: 1.5px solid ' + st.brand + '; margin-top: 4px; margin-bottom: 12px"></div>';

    // Summary / Personal Profile section
    if (P.summary && S.socialEnabled.summary) {
      h += sh('Leadership'); // Reuses Personal Profile styling
      h += '<div style="text-align:justify;line-height:1.5;margin-bottom:8px;font-size:10.5px">' + linkify(esc(P.summary)) + '</div>';
    }

    // Dynamic section ordering loop
    S.sectionOrder.forEach(function(secName) {
      
      if (secName === "Education" && E.length) {
        h += sh('Education'); 
        E.forEach(function (e) { 
          h += '<div style="margin-bottom:6px">';
          h += '  <div style="display:flex;justify-content:space-between;font-weight:700;color:' + st.col + ';font-size:11px"><span>' + esc(e.university) + '</span><span style="font-weight:700">' + esc(dr(e.start, e.end)) + '</span></div>';
          h += '  <div style="color:#4a5568;margin-top:1px;font-style:italic">' + esc(e.degree) + (e.loc ? ' | ' + esc(e.loc) : '') + '</div>';
          h += '</div>'; 
        });
      } 
      
      else if (secName === "Coursework") {
        var crs = C.filter(Boolean);
        if (crs.length) { 
          h += sh('Coursework'); 
          h += '<div class="rcrs" style="margin-bottom:6px">';
          var pc = Math.ceil(crs.length / 4); 
          for (var c = 0; c < 4; c++) { 
            var sl = crs.slice(c * pc, (c + 1) * pc); 
            if (sl.length) h += '<ul>' + sl.map(function (s) { return '<li style="line-height:1.4">• ' + esc(s) + '</li>'; }).join('') + '</ul>'; 
          } 
          h += '</div>'; 
        }
      } 
      
      else if (secName === "Experience" && X.length) {
        h += sh('Experience'); 
        X.forEach(function (e) { 
          h += '<div style="margin-bottom:10px">';
          h += '  <div style="display:flex;justify-content:space-between;font-weight:700;color:' + st.col + ';font-size:11px"><span>' + esc(e.role.toUpperCase()) + '</span><span style="font-weight:700">' + esc(dr(e.start, e.end)) + '</span></div>';
          h += '  <div style="color:#4a5568;font-size:10px;font-style:italic;margin-top:1px;margin-bottom:4px">' + esc(e.company) + (e.loc ? ' | ' + esc(e.loc) : '') + '</div>';
          h += '  <div style="line-height:1.5">' + renderBullets(e.bullets) + '</div>';
          h += '</div>'; 
        });
      } 
      
      else if (secName === "Projects" && Pr.length) {
        h += sh('Projects'); 
        Pr.forEach(function (p) { 
          h += '<div style="margin-bottom:10px">';
          h += '  <div style="display:flex;justify-content:space-between;font-weight:700;color:' + st.col + ';font-size:11px"><span>' + esc(p.name.toUpperCase()) + '</span><span style="font-weight:700">' + esc(p.date || '') + '</span></div>';
          if (p.tech) {
            h += '  <div style="color:#4a5568;font-size:9.5px;font-style:italic;margin-top:1px;margin-bottom:4px">' + esc(p.tech) + '</div>';
          }
          
          var links = [];
          if (p.github) {
            var ghUrl = p.github.startsWith('http') ? p.github : 'https://github.com/' + p.github;
            links.push('<a href="' + esc(ghUrl) + '" target="_blank" style="color:' + st.brand + ';text-decoration:underline;font-weight:600">GitHub</a>');
          }
          if (p.demo) {
            var demoUrl = p.demo.startsWith('http') ? p.demo : 'https://' + p.demo;
            links.push('<a href="' + esc(demoUrl) + '" target="_blank" style="color:' + st.brand + ';text-decoration:underline;font-weight:600">Live Demo</a>');
          }
          if (links.length) {
            h += '  <div style="font-size:9.5px;margin-top:2px;margin-bottom:4px;display:flex;gap:6px">' + links.join('<span style="color:#cbd5e1">|</span>') + '</div>';
          }
          
          h += '  <div style="line-height:1.5">' + renderBullets(p.bullets) + '</div>';
          h += '</div>';
        });
      } 
      
      else if (secName === "Skills") {
        // Collect skill categories
        var skillLists = [];
        if (Sk.languages) {
          Sk.languages.split(',').forEach(function(s) { if (s.trim()) skillLists.push(s.trim()); });
        }
        if (Sk.tech) {
          Sk.tech.split(',').forEach(function(s) { if (s.trim()) skillLists.push(s.trim()); });
        }
        if (Sk.tools) {
          Sk.tools.split(',').forEach(function(s) { if (s.trim()) skillLists.push(s.trim()); });
        }
        if (S.spokenLanguages) {
          S.spokenLanguages.split(',').forEach(function(s) { if (s.trim()) skillLists.push(s.trim()); });
        }
        
        if (skillLists.length) {
          h += sh('Skills');
          h += '<div class="rcrs" style="margin-bottom:10px">';
          
          // Divide skills beautifully across exactly 4 columns
          var cols = [[], [], [], []];
          for (var i = 0; i < skillLists.length; i++) {
            cols[i % 4].push(skillLists[i]);
          }
          
          for (var c = 0; c < 4; c++) {
            if (cols[c].length) {
              h += '<ul style="margin: 0; padding: 0; list-style-type: none">';
              cols[c].forEach(function(s) {
                h += '<li style="line-height:1.5; font-size: 10px; margin-bottom: 2px">• ' + esc(s) + '</li>';
              });
              h += '</ul>';
            }
          }
          h += '</div>';
        }
      } 
      
      else if (secName === "Languages" && S.spokenLanguages && !Sk.languages) {
        // Fallback only if not grouped in skills above
        h += sh('Languages'); 
        h += '<div style="line-height:1.5;margin-bottom:8px">' + esc(S.spokenLanguages) + '</div>';
      } 
      
      else if (secName === "Certifications" && Ct && Ct.length) {
        h += sh('Certifications'); 
        Ct.forEach(function (c) { 
          h += '<div style="margin-bottom:6px">';
          var np = c.url ? '<a href="' + esc(c.url) + '" target="_blank" style="color:inherit;text-decoration:underline;font-weight:700">' + esc(c.name) + '</a>' : '<span style="font-weight:700">' + esc(c.name) + '</span>';
          var providerPart = c.provider ? esc(c.provider) : '';
          var dateRange = dr(c.start, c.end);
          h += '  <div style="display:flex;justify-content:space-between;font-size:10.5px"><span>' + np + (providerPart ? ' / ' + providerPart : '') + '</span>' + (dateRange ? '<span style="font-weight:700">' + esc(dateRange) + '</span>' : '') + '</div>';
          h += '</div>'; 
        }); 
      } 
      
      else if (secName === "Leadership" && L && L.length) {
        h += sh('Leadership');
        L.forEach(function (e) {
          h += '<div style="margin-bottom:10px">';
          h += '  <div style="display:flex;justify-content:space-between;font-weight:700;font-size:11px"><span>' + esc(e.role || '') + (e.org ? ' - ' + esc(e.org) : '') + '</span><span style="font-weight:700">' + esc(dr(e.start, e.end)) + '</span></div>';
          h += '  <div style="line-height:1.5">' + renderBullets(e.bullets) + '</div>';
          h += '</div>';
        });
      }
      else if (secName === "References" && S.references) {
        h += sh('References');
        h += '<div style="font-size:10.5px;color:#4a5568;font-style:italic;line-height:1.5">' + linkify(esc(S.references)) + '</div>';
      }
      
    });
    
    h += '</div>'; // End main align body
    return h;
  };
})();
