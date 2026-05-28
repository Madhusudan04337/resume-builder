(function() {
  window.templates = window.templates || {};
  window.templates.elizabeth = function(S, SOCIAL_DEFS) {
    var P = S.personal, E = S.education, C = S.coursework, X = S.experience, Pr = S.projects, Sk = S.skills, L = S.leadership, Ct = S.certifications;
    
    // Sleek charcoal/slate accent color requested by user
    var brandColor = S.accentColor || "#2d3748";
    
    var st = { 
      // Premium uppercase geometric Montserrat font family
      font: "'Montserrat', 'Inter', 'Helvetica Neue', 'Arial', sans-serif", 
      sectionLine: "1px solid #cbd5e1", // Thin slate divider
      bg: "#ffffff", 
      col: "#2d3748", // High-contrast dark charcoal text
      brand: brandColor 
    };
    
    var esc = window.RT.esc, linkify = window.RT.linkify, dr = window.RT.dr;
    
    // Spacious, modern geometric bullet points (scaled to 11px)
    var renderBullets = function(bullets) {
      if (!bullets || !bullets.length) return '';
      var html = '<ul style="margin: 2px 0 4px 0; padding-left: 12px; list-style-type: disc; font-size: 11px; color: #2d3748">';
      bullets.forEach(function(b) {
        html += '<li style="margin-bottom: 3.5px; text-align: justify; line-height: 1.5">' + esc(b) + '</li>';
      });
      html += '</ul>';
      return html;
    };
    
    // Bold, spacious, modern uppercase section titles (scaled to 14px)
    var sh = function(label) {
      return '<div style="font-size:14px;font-weight:700;color:' + st.brand + ';margin-top:14px;margin-bottom:4px;letter-spacing:1.5px;text-transform:uppercase">' + esc(label) + '</div>';
    };

    var h = '<div style="font-family:' + st.font + ';color:' + st.col + ';line-height:1.5;font-size:11px;text-align:left">';
    
    // Header block inside an elegant rectangular box frame
    h += '<div style="border: 1.5px solid ' + st.brand + '; padding: 18px 22px; margin-bottom: 14px; box-sizing: border-box; display: flex; justify-content: space-between; align-items: center">';
    
    // Left side: Name and highly spaced title
    h += '  <div style="flex:1">';
    h += '    <div class="rn" style="font-size:28px;font-weight:800;color:' + st.brand + ';letter-spacing:-0.5px;line-height:1.05;text-transform:uppercase">' + esc(P.firstName) + (P.lastName ? ' ' + esc(P.lastName) : '') + '</div>';
    if (S.headline) {
      h += '    <div style="font-size:11.5px;font-weight:500;color:#64748b;margin-top:5px;text-transform:uppercase;letter-spacing:2px">' + esc(S.headline) + '</div>';
    }
    h += '  </div>';
    
    // Right side: Compact stacked contact details (scaled to 10.5px)
    var contactItems = [];
    if (P.phone && S.socialEnabled.phone) contactItems.push('<span>' + esc(P.phone) + ' ☎</span>');
    if (P.email && S.socialEnabled.email) {
      contactItems.push('<span><a href="mailto:' + esc(P.email) + '" style="color:inherit;text-decoration:none">' + esc(P.email) + '</a> @</span>');
    }
    if (P.address) contactItems.push('<span>' + esc(P.address) + ' 📍</span>');
    if (P.linkedin && S.socialEnabled.linkedin) {
      contactItems.push('<span><a href="' + (P.linkedin.startsWith('http') ? P.linkedin : 'https://linkedin.com/in/' + P.linkedin) + '" target="_blank" style="color:inherit;text-decoration:none">' + esc(P.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')) + '</a> <b>in</b></span>');
    }
    
    h += '  <div style="font-size:10.5px;color:#64748b;text-align:right;display:flex;flex-direction:column;gap:2.5px;line-height:1.2">';
    contactItems.forEach(function(item) {
      h += '    <div>' + item + '</div>';
    });
    h += '  </div>';
    
    h += '</div>'; // End Boxed Header Frame
    
    // Full-Width Summary Section (scaled to 11px)
    if (P.summary && S.socialEnabled.summary) {
      h += '<div style="font-size:14px;font-weight:700;color:' + st.brand + ';letter-spacing:1.5px;text-transform:uppercase;margin-top:14px;margin-bottom:4px">SUMMARY</div>';
      h += '<div style="text-align:justify;line-height:1.5;margin-bottom:12px;font-size:11px">' + linkify(esc(P.summary)) + '</div>';
      h += '<div style="border-bottom: 2.5px solid #cbd5e1; margin-top: 16px; margin-bottom: 0"></div>';
    }

    // Split dual column container
    h += '<div style="display:flex; justify-content:space-between; margin-top:0">';
    
    // Left Column (34% width) - Education, Skills, Coursework (scaled to 11px)
    h += '  <div style="width:34%; line-height:1.4">';
    
    // Education
    if (E.length) {
      h += sh('Education');
      E.forEach(function (e) {
        h += '<div style="margin-bottom:8px">';
        h += '  <div style="font-weight:700;color:' + st.brand + ';font-size:11.5px;text-transform:uppercase">' + esc(e.university) + '</div>';
        h += '  <div style="font-size:11px;color:#334155;margin-top:1px;font-weight:500">' + esc(e.degree) + '</div>';
        h += '  <div style="color:#64748b;font-size:10px;margin-top:1px">' + esc(dr(e.start, e.end)) + (e.loc ? ' | ' + esc(e.loc) : '') + '</div>';
        h += '</div>';
      });
    }
    
    // Spacer divider
    if (E.length && (Sk.languages || Sk.tools || Sk.tech || S.spokenLanguages)) {
      h += '<div style="margin-top: 10px; margin-bottom: 10px"></div>';
    }
    
    // Skills (do not include spoken languages)
    if (Sk.languages || Sk.tools || Sk.tech) {
      h += sh('Skills');
      if (Sk.languages) {
        h += '<div style="font-weight:600;color:#64748b;font-size:11px;margin-bottom:2px;margin-top:8px;">Programming Languages</div>';
        h += '<ul style="background:#f8fafc;border-radius:6px;padding:7px 12px 7px 18px;margin-bottom:6px;font-size:11px;color:#2d3748;list-style-type:disc;">';
        Sk.languages.split(/[,;]+/).forEach(function(skill) {
          if (skill.trim()) h += '<li style="margin-bottom:2.5px;line-height:1.5;">' + esc(skill.trim()) + '</li>';
        });
        h += '</ul>';
      }
      if (Sk.tools) {
        h += '<div style="font-weight:600;color:#64748b;font-size:11px;margin-bottom:2px;margin-top:8px;">Developer tools</div>';
        h += '<ul style="background:#f8fafc;border-radius:6px;padding:7px 12px 7px 18px;margin-bottom:6px;font-size:11px;color:#2d3748;list-style-type:disc;">';
        Sk.tools.split(/[,;]+/).forEach(function(skill) {
          if (skill.trim()) h += '<li style="margin-bottom:2.5px;line-height:1.5;">' + esc(skill.trim()) + '</li>';
        });
        h += '</ul>';
      }
      if (Sk.tech) {
        h += '<div style="font-weight:600;color:#64748b;font-size:11px;margin-bottom:2px;margin-top:8px;">Technologies / frameworks</div>';
        h += '<ul style="background:#f8fafc;border-radius:6px;padding:7px 12px 7px 18px;margin-bottom:6px;font-size:11px;color:#2d3748;list-style-type:disc;">';
        Sk.tech.split(/[,;]+/).forEach(function(skill) {
          if (skill.trim()) h += '<li style="margin-bottom:2.5px;line-height:1.5;">' + esc(skill.trim()) + '</li>';
        });
        h += '</ul>';
      }
    }

    // Spoken Languages (separate section)
    if (S.spokenLanguages) {
      h += sh('Languages');
      h += '<div style="background:#f8fafc;border-radius:6px;padding:7px 12px 7px 12px;margin-bottom:12px;font-size:11px;color:#2d3748;">' + esc(S.spokenLanguages) + '</div>';
    }
    
    h += '  </div>'; // End Left Column
    
    // Clean solid vertical column line
    h += '  <div style="border-right: 2.5px solid #cbd5e1b6; margin: 0 18px"></div>';
    
    // Right Column (66% width) - Work Experience, Projects, Certifications, Leadership, References (scaled to 11px/12px)
    h += '  <div class="r-main-col" style="flex:1">';
    
    S.sectionOrder.forEach(function(secName) {
      
      if (secName === "Experience" && X.length) {
        h += sh('Work Experience');
        X.forEach(function (e) {
          h += '<div style="margin-bottom:10px">';
          h += '  <div style="display:flex;justify-content:space-between;font-weight:700;color:' + st.brand + ';font-size:12px;text-transform:uppercase"><span>' + esc(e.role) + '</span><span>' + esc(dr(e.start, e.end)) + '</span></div>';
          h += '  <div style="color:#64748b;font-size:11px;font-style:normal;margin-top:1px;margin-bottom:4px;font-weight:500">' + esc(e.company) + (e.loc ? ' | ' + esc(e.loc) : '') + '</div>';
          h += '  <div style="line-height:1.5">' + renderBullets(e.bullets) + '</div>';
          h += '</div>';
        });
      }
      
      else if (secName === "Projects" && Pr.length) {
        h += sh('Projects');
        Pr.forEach(function (p) {
          h += '<div style="margin-bottom:10px">';
          h += '  <div style="display:flex;justify-content:space-between;font-weight:700;color:' + st.brand + ';font-size:12px;text-transform:uppercase"><span>' + esc(p.name) + '</span><span>' + esc(p.date || '') + '</span></div>';
          if (p.tech) {
            h += '  <div style="color:#64748b;font-size:10.5px;font-style:italic;margin-top:1px;margin-bottom:4px">' + esc(p.tech) + '</div>';
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
            h += '  <div style="font-size:10.5px;margin-top:2px;margin-bottom:4px;display:flex;gap:6px">' + links.join('<span style="color:#cbd5e1">|</span>') + '</div>';
          }
          
          h += '  <div style="line-height:1.5">' + renderBullets(p.bullets) + '</div>';
          h += '</div>';
        });
      }
      
      else if (secName === "Certifications" && Ct && Ct.length) {
        h += sh('Certifications');
        Ct.forEach(function (c) {
          h += '<div style="margin-bottom:6px">';
          var np = c.url ? '<a href="' + esc(c.url) + '" target="_blank" style="color:inherit;text-decoration:underline;font-weight:700">' + esc(c.name) + '</a>' : '<span style="font-weight:700">' + esc(c.name) + '</span>';
          var providerPart = c.provider ? esc(c.provider) : '';
          var dateRange = dr(c.start, c.end);
          h += '  <div style="display:flex;justify-content:space-between;font-size:11px"><span>' + np + (providerPart ? ' / ' + providerPart : '') + '</span>' + (dateRange ? '<span style="font-weight:700">' + esc(dateRange) + '</span>' : '') + '</div>';
          h += '</div>';
        });
      }
      
      else if (secName === "Leadership" && L && L.length) {
        h += sh('Leadership');
        L.forEach(function (e) {
          h += '<div style="margin-bottom:10px">';
          h += '  <div style="display:flex;justify-content:space-between;font-weight:700;font-size:12px;text-transform:uppercase"><span>' + esc(e.role || '') + (e.org ? ' - ' + esc(e.org) : '') + '</span><span>' + esc(dr(e.start, e.end)) + '</span></div>';
          h += '  <div style="line-height:1.5">' + renderBullets(e.bullets) + '</div>';
          h += '</div>';
        });
      }
      
      else if (secName === "References" && S.references) {
        h += sh('References');
        h += '<div style="font-size:11px;color:#64748b;font-style:italic;line-height:1.5">' + linkify(esc(S.references)) + '</div>';
      }
      
    });
    
    h += '  </div>'; // End Right Column
    
    h += '</div>'; // End split container
    
    h += '</div>'; // End main align body
    return h;
  };
})();
