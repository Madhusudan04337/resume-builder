(function() {
  window.templates = window.templates || {};
  window.templates.jakes = function(S, SOCIAL_DEFS) {
    var P = S.personal, E = S.education, C = S.coursework, X = S.experience, Pr = S.projects, Sk = S.skills, L = S.leadership, Ct = S.certifications;
    
    var brandColor = S.accentColor || "#32166f"; // Indigo Deep for Jake's
    
    var st = { 
      font: "'Georgia', 'Garamond', serif", 
      sectionLine: "1px solid " + brandColor, 
      bg: "#ffffff", 
      col: "#111111", 
      brand: brandColor 
    };
    
    var esc = window.RT.esc, linkify = window.RT.linkify, dr = window.RT.dr;
    
    // Mathematically perfect inline bullet list renderer with 15px indentation and breathing gaps
    var renderBullets = function(bullets) {
      if (!bullets || !bullets.length) return '';
      var html = '<ul style="margin: 2px 0 0 0; padding-left: 15px; list-style-type: disc; font-size: 10px; color: #111111">';
      bullets.forEach(function(b) {
        html += '<li style="margin-bottom: 2px; padding-left: 0px; text-align: justify; line-height: 1.3">' + esc(b) + '</li>';
      });
      html += '</ul>';
      return html;
    };
    
    // Balanced section titles (Title Case) with consistent padding, 1px dividers, styled in st.brand
    var sh = function(label) {
      var displayLabel = label;
      if (label === "Experience") displayLabel = "Work Experience";
      else if (label === "Projects") displayLabel = "Technical Projects";
      else if (label === "Leadership") displayLabel = "Achievements";
      
      return '<div style="font-size:13px;font-weight:700;color:' + st.brand + ';margin-top:10px;margin-bottom:2px;letter-spacing:-0.2px">' + esc(displayLabel) + '</div>' +
             '<div style="border-bottom: ' + st.sectionLine + '; margin-top: 0px; margin-bottom: 5px"></div>';
    };

    var h = '<div style="font-family:' + st.font + ';color:' + st.col + ';line-height:1.3;font-size:10px;text-align:left">';
    
    // Left-aligned Header Block (Minimalist & clean - no decorative lines or images)
    h += '<div style="text-align:left;margin-bottom:12px">';
    h += '  <div class="rn" style="font-size:25px;font-weight:800;color:' + st.brand + ';letter-spacing:-0.8px;line-height:1.15">' + esc(P.firstName) + (P.lastName ? ' ' + esc(P.lastName) : '') + '</div>';
    
    if (S.headline) {
      h += '  <div style="font-size:12.5px;font-weight:500;color:' + st.brand + ';margin-top:3px;margin-bottom:6px;text-transform:none">' + esc(S.headline) + '</div>';
    }
    
    // Consistent, minimal outline icons for contact info (same stroke thickness and size, translated 1.2px up for baseline perfection)
    var emailIcon = '<svg style="width:10px;height:10px;fill:none;stroke:' + st.brand + ';stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;display:inline-block;vertical-align:middle;margin-right:3px;transform:translateY(-1.2px)" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>';
    var phoneIcon = '<svg style="width:10px;height:10px;fill:none;stroke:' + st.brand + ';stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;display:inline-block;vertical-align:middle;margin-right:3px;transform:translateY(-1.2px)" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
    var locIcon = '<svg style="width:10px;height:10px;fill:none;stroke:' + st.brand + ';stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;display:inline-block;vertical-align:middle;margin-right:3px;transform:translateY(-1.2px)" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
    var ghIcon = '<svg style="width:10px;height:10px;fill:none;stroke:' + st.brand + ';stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;display:inline-block;vertical-align:middle;margin-right:3px;transform:translateY(-1.2px)" viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>';
    var liIcon = '<svg style="width:10px;height:10px;fill:none;stroke:' + st.brand + ';stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;display:inline-block;vertical-align:middle;margin-right:3px;transform:translateY(-1.2px)" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>';
    var demoIcon = '<svg style="width:10px;height:10px;fill:' + st.brand + ';display:inline-block;vertical-align:middle;margin-right:3px;transform:translateY(-1.2px)" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/><path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/></svg>';
    
    var row1Items = [];
    var row2Items = [];
    
    // Line 1: email, phone number, location, portfolio
    if (P.email && S.socialEnabled.email) {
      row1Items.push('<span style="display:inline-flex;align-items:center">' + emailIcon + '<a href="mailto:' + esc(P.email) + '" style="color:inherit;text-decoration:underline">' + esc(P.email) + '</a></span>');
    }
    if (P.phone && S.socialEnabled.phone) {
      row1Items.push('<span style="display:inline-flex;align-items:center">' + phoneIcon + esc(P.phone) + '</span>');
    }
    if (P.address) {
      row1Items.push('<span style="display:inline-flex;align-items:center">' + locIcon + esc(P.address) + '</span>');
    }
    if (P.portfolio && S.socialEnabled.portfolio) {
      var portUrl = P.portfolio.startsWith('http') ? P.portfolio : 'https://' + P.portfolio;
      row1Items.push('<span style="display:inline-flex;align-items:center">' + demoIcon + '<a href="' + esc(portUrl) + '" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline">' + esc(portUrl) + '</a></span>');
    }
    
    // Line 2: linkedin, github, others
    if (P.linkedin && S.socialEnabled.linkedin) {
      var liUrl = P.linkedin.startsWith('http') ? P.linkedin : 'https://linkedin.com/in/' + P.linkedin;
      row2Items.push('<span style="display:inline-flex;align-items:center">' + liIcon + '<a href="' + esc(liUrl) + '" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline">' + esc(liUrl) + '</a></span>');
    }
    if (P.github && S.socialEnabled.github) {
      var ghUrl = P.github.startsWith('http') ? P.github : 'https://github.com/' + P.github;
      row2Items.push('<span style="display:inline-flex;align-items:center">' + ghIcon + '<a href="' + esc(ghUrl) + '" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline">' + esc(ghUrl) + '</a></span>');
    }
    
    // Other enabled socials
    SOCIAL_DEFS.forEach(function (sd) {
      if (['email', 'phone', 'linkedin', 'github', 'portfolio'].indexOf(sd.key) !== -1) return;
      if (!S.socialEnabled[sd.key]) return;
      var val = P[sd.key] || ''; if (!val) return;
      var href = sd.isLink ? (val.startsWith('http') ? val : sd.prefix + val) : null;
      row2Items.push('<span style="display:inline-flex;align-items:center"><span style="font-size:9px;font-weight:700;margin-right:2px">' + sd.icon + '</span>' + (href ? '<a href="' + esc(href) + '" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline">' + esc(href) + '</a>' : esc(val)) + '</span>');
    });
    
    // Balanced vertical pipe separator spaces (exactly 5px left/right margins)
    if (row1Items.length || row2Items.length) {
      h += '  <div style="font-size:9.5px;color:#333333;margin-top:6px;display:flex;flex-direction:column;gap:4px;justify-content:flex-start">';
      if (row1Items.length) {
        h += '    <div style="display:flex;gap:0px;flex-wrap:wrap;justify-content:flex-start">' + row1Items.join('<span style="color:#cccccc;margin:0 5px">|</span>') + '</div>';
      }
      if (row2Items.length) {
        h += '    <div style="display:flex;gap:0px;flex-wrap:wrap;justify-content:flex-start">' + row2Items.join('<span style="color:#cccccc;margin:0 5px">|</span>') + '</div>';
      }
      h += '  </div>';
    }
    h += '</div>'; // End Header block
    
    // Header bottom padding spacer (no divider line)
    h += '<div style="margin-top: 4px; margin-bottom: 10px"></div>';

    // Summary section
    if (P.summary && S.socialEnabled.summary) {
      h += sh('Career Objective');
      h += '<div style="text-align:justify;line-height:1.45;margin-bottom:8px">' + linkify(esc(P.summary)) + '</div>';
    }

    // Dynamic section ordering loop
    S.sectionOrder.forEach(function(secName) {
      
      if (secName === "Education" && E.length) {
        h += sh('Education'); 
        E.forEach(function (e) { 
          h += '<div style="margin-bottom:4px">'; // Reduced spacing between school entries
          // School name styled in brandColor
          h += '  <div style="display:flex;justify-content:space-between;font-weight:700;color:' + st.brand + ';font-size:11px"><span>' + esc(e.university) + '</span>' + (e.loc ? '<span style="color:' + st.brand + ';font-weight:500;padding-right:12px">' + esc(e.loc) + '</span>' : '') + '</div>';
          
          var degreeLine = esc(e.degree);
          var dateRange = dr(e.start, e.end);
          if (dateRange) {
            degreeLine += ' (' + esc(dateRange) + ')';
          }
          h += '  <div style="color:#475569;margin-top:1px;font-style:normal;font-weight:normal">' + degreeLine + '</div>';
          h += '</div>'; 
        });
      } 
      
      else if (secName === "Coursework") {
        var crs = C.filter(Boolean);
        if (crs.length) { 
          h += sh('Relevant Coursework'); 
          h += '<div class="rcrs" style="margin-bottom:6px">';
          var pc = Math.ceil(crs.length / 4); 
          for (var c = 0; c < 4; c++) { 
            var sl = crs.slice(c * pc, (c + 1) * pc); 
            if (sl.length) h += '<ul>' + sl.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>'; 
          } 
          h += '</div>'; 
        }
      } 
      
      else if (secName === "Experience" && X.length) {
        h += sh('Experience'); 
        X.forEach(function (e) { 
          h += '<div style="margin-bottom:8px">';
          // Roles & companies styled in brandColor
          h += '  <div style="display:flex;justify-content:space-between;font-weight:700;color:' + st.brand + ';font-size:11px"><span>' + esc(e.role) + ' - ' + esc(e.company) + '</span><span style="font-weight:normal;font-style:normal;color:#475569;padding-right:12px">' + esc(dr(e.start, e.end)) + '</span></div>';
          // Secondary element: reduced tech stack size to 9.5px and styled color #475569 for clean visual hierarchy
          if (e.tech) {
            h += '  <div style="color:#475569;font-size:9.5px;font-style:normal;font-weight:500;margin-top:2px;margin-bottom:5px">' + esc(e.tech) + '</div>';
          }
          h += '  <div style="line-height:1.4">' + renderBullets(e.bullets) + '</div>';
          h += '</div>'; 
        });
      } 
      
      else if (secName === "Projects" && Pr.length) {
        h += sh('Projects'); 
        Pr.forEach(function (p) { 
          h += '<div style="margin-bottom:8px">';
          // Project name styled in brandColor
          h += '  <div style="display:flex;justify-content:space-between;font-weight:700;color:' + st.brand + ';font-size:11px"><span>' + esc(p.name) + '</span><span style="font-weight:normal;font-style:normal;color:#475569;padding-right:12px">' + esc(p.date || '') + '</span></div>';
          // Secondary element: reduced tech stack size to 9.5px and styled color #475569 for clean visual hierarchy
          if (p.tech) {
            h += '  <div style="color:#475569;font-size:9.5px;font-style:normal;font-weight:500;margin-top:2px;margin-bottom:5px">' + esc(p.tech) + '</div>';
          }
          
          var links = [];
          
          // Render explicit GitHub Repository Link with consistent outline SVG icons
          if (p.github) {
            var ghUrl = p.github.startsWith('http') ? p.github : 'https://github.com/' + p.github;
            links.push('<span style="display:inline-flex;align-items:center">' + ghIcon + '<a href="' + esc(ghUrl) + '" target="_blank" style="color:' + st.brand + ';text-decoration:underline;font-weight:600">GitHub Repository</a></span>');
          }
          
          // Render explicit Live Demo Link with consistent outline SVG icons
          if (p.demo) {
            var demoUrl = p.demo.startsWith('http') ? p.demo : 'https://' + p.demo;
            links.push('<span style="display:inline-flex;align-items:center">' + demoIcon + '<a href="' + esc(demoUrl) + '" target="_blank" style="color:' + st.brand + ';text-decoration:underline;font-weight:600">Live Demo</a></span>');
          }
          
          var filteredBullets = [];
          if (p.bullets && p.bullets.length) {
            p.bullets.forEach(function(b) {
              var urlMatch = b.match(/https?:\/\/[^\s]+/g);
              if (urlMatch) {
                // Fallback URL parser only if explicit inputs are not populated
                if (!p.github && !p.demo) {
                  urlMatch.forEach(function(url) {
                    var cleanUrl = url.replace(/[\),\.\s]+$/, '');
                    if (cleanUrl.toLowerCase().includes('github.com')) {
                      links.push('<span style="display:inline-flex;align-items:center">' + ghIcon + '<a href="' + esc(cleanUrl) + '" target="_blank" style="color:' + st.brand + ';text-decoration:underline;font-weight:600">GitHub Repository</a></span>');
                    } else {
                      links.push('<span style="display:inline-flex;align-items:center">' + demoIcon + '<a href="' + esc(cleanUrl) + '" target="_blank" style="color:' + st.brand + ';text-decoration:underline;font-weight:600">Live Demo</a></span>');
                    }
                  });
                }
                var cleanBullet = b.replace(urlMatch[0], '').trim();
                if (cleanBullet.replace(/^[•\s\-|#]+/g, '').trim().length > 2) {
                  filteredBullets.push(b);
                }
              } else {
                filteredBullets.push(b);
              }
            });
          }
          
          // Spacious breathing gaps for project links (5px vertical gap, 6px spacing around dividers)
          if (links.length) {
            h += '  <div style="font-size:10px;margin-top:5px;margin-bottom:5px;display:flex;gap:0px;justify-content:flex-start">' + links.join('<span style="color:#cccccc;margin:0 6px">|</span>') + '</div>';
          }
          
          if (filteredBullets.length) {
            h += '  <div style="line-height:1.4">' + renderBullets(filteredBullets) + '</div>'; 
          }
          h += '</div>';
        });
      } 
      
      else if (secName === "Skills" && (Array.isArray(Sk) ? Sk.some(s => s.category && s.list) : (Sk.languages || Sk.tools || Sk.tech))) {
        h += sh('Skills'); 
        h += '<div style="line-height:1.55;margin-bottom:8px;font-size:10px">';
        if (Array.isArray(Sk)) {
          Sk.forEach(function(s) {
            if (s.category && s.list) {
              h += '<div style="margin-bottom:4px"><span style="font-weight:600;color:' + st.brand + '">' + esc(s.category) + '</span>: ' + esc(s.list) + '</div>';
            }
          });
        } else {
          if (Sk.languages) {
            h += '<div style="margin-bottom:4px"><span style="font-weight:600;color:' + st.brand + '">Languages</span>: ' + esc(Sk.languages) + '</div>';
          }
          if (Sk.tech) {
            h += '<div style="margin-bottom:4px"><span style="font-weight:600;color:' + st.brand + '">Technologies / Frameworks</span>: ' + esc(Sk.tech) + '</div>';
          }
          if (Sk.tools) {
            h += '<div style="margin-bottom:4px"><span style="font-weight:600;color:' + st.brand + '">Developer Tools</span>: ' + esc(Sk.tools) + '</div>';
          }
        }
        h += '</div>';
      } 	 
      
      else if (secName === "Languages" && S.spokenLanguages) {
        h += sh('Languages'); 
        h += '<div style="line-height:1.4;margin-bottom:6px;white-space: pre-line">' + esc(S.spokenLanguages) + '</div>';
      } 
      
      else if (secName === "Certifications" && Ct && Ct.length) {
        h += sh('Certifications'); 
        h += '<div class="rcert" style="margin-bottom:6px"><ul>'; 
        Ct.forEach(function (c) { 
          var np = '';
          if (c.url) {
            np = '<a href="' + esc(c.url) + '" target="_blank" style="color:#0033bb;text-decoration:underline;font-weight:600">' + esc(c.name) + '</a>';
          } else {
            np = '<span style="font-weight:600;color:' + st.brand + '">' + esc(c.name) + '</span>';
          }
          var providerPart = c.provider ? ' - ' + esc(c.provider) : '';
          var dateRange = dr(c.start, c.end);
          var datePart = dateRange ? ' (' + esc(dateRange) + ')' : '';
          h += '<li style="margin-bottom:5px">• ' + np + providerPart + datePart + '</li>'; 
        }); 
        h += '</ul></div>';
      } 
      
      else if (secName === "Leadership" && L && L.length) {
        h += sh('Leadership');
        h += '<div class="rcert" style="margin-bottom:6px"><ul>';
        L.forEach(function (e) {
          if (e.role || e.org) {
            h += '<div style="margin-bottom:6px;list-style-type:none">';
            // Dates on the far right brought inward by 12px right padding, roles styled in st.brand
            h += '  <div style="display:flex;justify-content:space-between;font-weight:700;color:' + st.brand + '"><span>' + esc(e.role || '') + (e.org ? ' - ' + esc(e.org) : '') + '</span><span style="font-weight:normal;font-style:normal;color:#475569;padding-right:12px">' + esc(dr(e.start, e.end)) + '</span></div>';
            if (e.bullets && e.bullets.length) {
              h += '<div style="margin-top:2px">' + renderBullets(e.bullets) + '</div>';
            }
            h += '</div>';
          } else if (e.bullets && e.bullets.length) {
            e.bullets.forEach(function(b) {
              h += '<li style="margin-bottom:5px">• ' + esc(b) + '</li>';
            });
          }
        });
        h += '</ul></div>';
      } else if (secName === "References" && S.references) {
        h += sh('References');
        h += '<div style="font-size:10px;color:#111;font-style:italic;line-height:1.45;margin-bottom:8px">' + linkify(esc(S.references)) + '</div>';
      }
      
      else if (secName.startsWith("custom_")) {
        var cs = (S.customSections || []).find(function(c) { return c.id === secName; });
        if (cs && cs.heading && cs.content) {
          h += sh(cs.heading);
          h += '<div style="text-align:justify;line-height:1.45;margin-bottom:8px;white-space:pre-line">' + linkify(esc(cs.content)) + '</div>';
        }
      }
      
    });
    
    h += '</div>'; // End left align body
    h += '</div>'; // End container
    return h;
  };
})();
