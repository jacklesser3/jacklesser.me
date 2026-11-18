#!/usr/bin/env python3
"""Build the four-page TerraFirma proposal, neon masters, and matching exports.

Typography is native outlined SVG. Illustration assets are generated separately
with the prompts in terrafirma-artwork-v4-prompts.json. Budget rows are retained
in the shared content JSON. Run before the existing HTML-to-PDF renderer.
"""
from pathlib import Path
from html import escape
import base64
import csv
import io
import json
import re
import subprocess
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/terrafirma_billboard_campaign'
ART=OUT/'img/v4'
DL=OUT/'downloads'
DATA=json.loads((ROOT/'scripts/terrafirma-campaign-content.json').read_text())
CITIES=DATA['cities']; AUSTIN=DATA['austin']
REFERENCE=json.loads((ROOT/'scripts'/DATA['budget_reference']).read_text())
FULL_AUSTIN=REFERENCE['austin']; BOSTON=REFERENCE['boston']
CONTINGENCY=DATA['contingency_rate']
VERSION=DATA['version']
INK='#14182A'; BONE='#EFEBE4'
ART.mkdir(exist_ok=True); DL.mkdir(exist_ok=True)
FONT=TTFont(OUT/'fonts/big-shoulders-900.ttf')
BODYFONT=TTFont(OUT/'fonts/archivo-700.ttf')

def money(n): return f'${n:,.0f}'
def totals(rows):
    low=sum(r[2]*r[4] for r in rows); high=sum(r[2]*r[5] for r in rows)
    return low,high,round(low*CONTINGENCY),round(high*CONTINGENCY),round(low*(1+CONTINGENCY)),round(high*(1+CONTINGENCY))
AL,AH,ACL,ACH,ATL,ATH=totals(AUSTIN)
BL,BH,BCL,BCH,BTL,BTH=totals(BOSTON)
FL,FH,FCL,FCH,FTL,FTH=totals(FULL_AUSTIN)

def vector_text(text,x,baseline,size,font=FONT,spacing=0):
    glyphs=font.getGlyphSet(); cmap=font.getBestCmap(); scale=size/font['head'].unitsPerEm
    paths=[]; cursor=x
    for char in text:
        name=cmap.get(ord(char),'.notdef'); pen=SVGPathPen(glyphs)
        glyphs[name].draw(TransformPen(pen,(scale,0,0,-scale,cursor,baseline)))
        paths.append(pen.getCommands()); cursor+=glyphs[name].width*scale+spacing
    return ' '.join(paths),cursor-x-spacing

def width(text,size,font=FONT): return vector_text(text,0,0,size,font)[1]
logo=(OUT/'img/v3/official-logo-1.svg').read_text()
logo_inner=re.search(r'<svg[^>]*>(.*)</svg>',logo,re.S)[1].replace('currentColor',INK)
def wordmark(x,y,w): return f'<g transform="translate({x} {y}) scale({w/1164})">{logo_inner}</g>'

def typography(c):
    defs=['<filter id="bloom" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="22"/></filter>',
          '<filter id="tube-glow" x="-12%" y="-25%" width="124%" height="150%"><feGaussianBlur stdDeviation="6"/></filter>']
    body=[wordmark(900,78,900)]
    size=min(c['size'],min(1180/width(line,1) for line in c['lines']))
    start,step=(465,210) if len(c['lines'])==2 else (385,147)
    for i,line in enumerate(c['lines']):
        d,_=vector_text(line,900,start+i*step,size)
        defs.append(f'<path id="letter-{i}" d="{d}"/>')
        ref=f'href="#letter-{i}"'
        body.extend([
          f'<use {ref} fill="none" stroke="#FF713F" stroke-width="30" opacity=".42" filter="url(#bloom)"/>',
          f'<use {ref} fill="none" stroke="#FF854B" stroke-width="20" opacity=".82" filter="url(#tube-glow)"/>',
          f'<use {ref} fill="#FFF7E7" stroke="#DF652D" stroke-width="13" stroke-linejoin="round" paint-order="stroke fill"/>',
          f'<use {ref} fill="none" stroke="#FFF9EB" stroke-width="2.5" stroke-linejoin="round"/>'])
    cta=c.get('cta','BUILD WITH US IN TEXAS')
    for text,baseline,size,spacing in [(cta,798,min(58,1150/width(cta,1,BODYFONT)),0),('TERRAFIRMA.INC',885,58,2)]:
        d,_=vector_text(text,900,baseline,size,BODYFONT,spacing)
        body.append(f'<path fill="{INK}" d="{d}"/>')
    return '<defs>'+''.join(defs)+'</defs>'+''.join(body)

def svg(body,title):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="3000" height="1000" viewBox="0 0 3000 1000" role="img"><title>{escape(title)}</title>{body}</svg>'

for c in CITIES:
    src=ART/f'{c["id"]}-background.png'
    if not src.exists(): raise FileNotFoundError(f'Generate {src.name} before building the proposal')
    webp=src.with_suffix('.webp')
    if not webp.exists() or webp.stat().st_mtime<src.stat().st_mtime:
        subprocess.run(['cwebp','-quiet','-q','91','-m','6',str(src),'-o',str(webp)],check=True)
    typ=typography(c)
    title=f'TerraFirma — {c["name"]}: {" ".join(c["lines"])} {c.get("cta","Build with us in Texas")}. terrafirma.inc'
    (ART/f'type-{c["id"]}.svg').write_text(svg(typ,title))
    encoded=base64.b64encode(webp.read_bytes()).decode()
    full=f'<image x="0" y="0" width="3000" height="1000" href="data:image/webp;base64,{encoded}"/>{typ}'
    (DL/f'billboard-{c["id"]}.svg').write_text(svg(full,title))

def write_budget_csv(filename,scenarios):
    csv_buffer=io.StringIO(); writer=csv.writer(csv_buffer,lineterminator='\n')
    writer.writerow(['Scenario','Category','Line item','Quantity','Unit','Unit low USD','Unit high USD','Extended low USD','Extended high USD','Basis / owner'])
    for scenario,rows in scenarios:
        for cat,item,q,unit,lo,hi,owner in rows:
            writer.writerow([scenario,cat,item,q,unit,lo,hi,q*lo,q*hi,owner+'; planning allowance, not a quote'])
        lo,hi,cl,ch,tl,th=totals(rows)
        for label,a,b in [('Subtotal',lo,hi),('Contingency 15%',cl,ch),('TOTAL',tl,th)]:
            writer.writerow([scenario,label,'','','','','',a,b,'USD; no vendor commitments; internal payroll and owned assets excluded'])
    (DL/filename).write_text(csv_buffer.getvalue())
write_budget_csv('terrafirma-pilot-budget.csv',[('Austin first billboard test',AUSTIN)])
write_budget_csv('terrafirma-expanded-budget-reference.csv',[('Austin recommended pilot',FULL_AUSTIN),('Boston optional expansion',BOSTON)])
(OUT/'campaign-data.json').write_text(json.dumps(DATA,indent=2)+'\n')
(OUT/'expanded-budget-reference.json').write_text(json.dumps(REFERENCE,indent=2)+'\n')


def board(c,lazy=True):
    label=escape(f'{c["name"]}: {" ".join(c["lines"])} {c.get("cta","Build with us in Texas")}. terrafirma.inc')
    loading='lazy' if lazy else 'eager'
    return f'<span class="billboard" role="img" aria-label="{label}"><img class="board-bg" src="img/v4/{c["id"]}-background.webp" alt="" width="2172" height="724" loading="{loading}"><img class="board-type" src="img/v4/type-{c["id"]}.svg?v=5" alt="" width="3000" height="1000" loading="{loading}"></span>'

def tile(c,n):
    status='First test' if c['id']=='austin' else 'Concept'
    return f'<button type="button" class="tile" data-city="{c["id"]}" aria-label="Expand {c["name"]} billboard"><span class="tile-caption"><span><i>{n:02d}</i> {escape(c["name"])}</span><span class="tile-meta"><span class="tile-status">{status}</span><span class="tile-zoom">Expand <b aria-hidden="true">↗</b></span></span></span>{board(c,False)}</button>'

def table(rows):
    s='<div class="table-scroll"><table><caption>Planning allowances in USD; written quotes required before commitment.</caption><thead><tr><th>Item / quantity</th><th>Low</th><th>High</th></tr></thead><tbody>'
    for cat,item,q,unit,lo,hi,owner in rows:
        s+=f'<tr><td>{escape(item)}<small>{q} {escape(unit)} · {money(lo)}–{money(hi)} each</small></td><td>{money(q*lo)}</td><td>{money(q*hi)}</td></tr>'
    lo,hi,cl,ch,tl,th=totals(rows)
    for name,a,b in [('Subtotal',lo,hi),('Contingency · 15%',cl,ch),('Planning envelope',tl,th)]:
        s+=f'<tr class="total"><td>{name}</td><td>{money(a)}</td><td>{money(b)}</td></tr>'
    return s+'</tbody></table></div>'

def fold(title,body,id=''):
    ident=f' id="{id}"' if id else ''
    return f'<details class="fold"{ident}><summary>{title}<span aria-hidden="true">+</span></summary><div class="fold-body">{body}</div></details>'

BUDGET_NOTES='<p>This first test covers two standard static Austin bulletins for four weeks, finalizing the existing Austin creative, print and posting, a light update to the existing careers journey, and basic reporting. Internal team time remains in-house.</p><p><strong>Media benchmark:</strong> <a href="https://www.bluelinemedia.com/billboard-advertising/austin-tx" target="_blank" rel="noopener">Blue Line Media’s published Austin estimate</a> is $5,000–$8,000 per static bulletin for four weeks, checked November 18, 2026. This is a starting benchmark, not a quote for selected sites. All other lines are planning allowances.</p><p>Select dates and inventory to fit the test. Premium placements, event premiums, custom fabrication, a new website build, paid amplification, filming, and a live demonstration are outside this scope. Quotes must specify taxes, fees, printing, installation, and removal. Any costs above the allowance need a revised total before commitment.</p>'
TIMELINE_NOTES='<ol class="plain-list"><li><strong>Prepare:</strong> confirm priority Texas roles, choose two relevant Austin faces, obtain written all-in quotes, and establish the current recruiting baseline.</li><li><strong>Before launch:</strong> finalize the artwork to vendor dimensions, verify the careers journey and source tracking, and approve the production proof. Set the start date around inventory and posting lead times.</li><li><strong>Run for four weeks:</strong> use one Austin creative on both faces; check posting, readability, site traffic, and candidate-source data. This tests the campaign as a whole, not an A/B comparison.</li><li><strong>Review:</strong> assess response when the flight ends; follow the candidate funnel at 30, 60, and 90 days after it ends. Use the results to shape any next investment.</li></ol><p class="quiet">Dates remain to be quoted and confirmed. The test is not tied to SXSW or another event. Live experiences and additional markets remain future options.</p>'
REFERENCE_NOTES='<p>The earlier, fuller planning scenarios are preserved here for future development: an Austin billboard flight plus a live demonstration, followed by an optional Boston test. These are alternative future scopes, not additions to the first-test total. The full Austin scenario already includes media and creative; do not add it to the lean test budget.</p><p>These are the original planning allowances, retained without repricing. Recheck scope, dates, inventory, staffing, and vendor quotes before using them. Internal payroll and owned-asset costs remain excluded.</p>'

MEASURE_NOTES='''<p>Before launch, recruiting defines priority Texas roles, qualification criteria, a maximum cost per qualified screen, a minimum evaluable cohort, and a follow-up owner. Compare the campaign with the prior 90-day funnel and a relevant comparison channel or market where practical.</p><p>Track message recall, relevant role visits, qualified applications, completed screens, interviews, offers, acceptances, and starts. Record first-touch, assisted, and self-reported source; billboard exposure cannot be individually attributed. Measure retention 90 days after each hire’s start date.</p><p>Expand only when candidate quality and acquisition cost meet the agreed criteria and delivery works reliably. Weak or incomplete evidence calls for improving the test, not automatically adding cities.</p>'''
PRODUCTION_NOTES='''<p>The chrome Operator, warm bone ground, Mars orange, luminous headline, excavator, skyline, and rocket form the common visual system. Pose, workwear, helmet detail, city silhouettes, and small rim-light accents create local character.</p><p>The headline uses warm-white lettering, a defined coral-orange edge, and a restrained orange glow. The light core carries the neon feeling without a black letter fill. Keep the wordmark and hiring line clean. Check the actual media-owner sightline and a three-second read, then proof day and night color, safe areas, and vendor dimensions before production.</p><p>These are proposal concepts. The Operator is an illustrated brand character, not a claimed TerraFirma humanoid product. Miami needs fluent Spanish review and a matching recruiting journey. Use current Texas roles and confirmed relocation terms. The boards use the existing company URL; any campaign redirect must work before a different address is printed.</p>'''
SOURCES=[('TerraFirma — mission, products, and Texas projects','https://terrafirma.inc/'),('TerraFirma — current roles','https://jobs.ashbyhq.com/TerraFirma-Inc'),('Blue Line Media — Austin media pricing benchmark','https://www.bluelinemedia.com/billboard-advertising/austin-tx')]

campaign=f'''<div class="page-heading"><div><span class="kicker">01 / The campaign</span><h1>Texas Born. <em>Mars Bound.</em></h1></div><p>Ten cities. One world.<br>Local character, shared ambition.<span class="zoom-prompt"><span aria-hidden="true">↗</span> Select any billboard to expand</span></p></div><div class="board-wall">{''.join(tile(c,i+1) for i,c in enumerate(CITIES))}</div><p class="wall-note"><span>Creative proposal · Ten concepts in one shared system</span><span>Austin is the first test. Other cities remain concepts.</span></p>'''

portraits=''.join(f'<button class="portrait" type="button" data-city="{c["id"]}" aria-label="Explore the {c["name"]} Operator"><span class="portrait-art"><img src="img/v4/{c["id"]}-background.webp" alt="" loading="lazy"></span><span>{c["name"]}</span></button>' for c in CITIES)
brand=f'''<div class="page-heading"><div><span class="kicker">02 / The story</span><h1>Built in Texas.<br><em>Building toward Mars.</em></h1></div><p>TerraFirma brings software, robotics, and construction teams together to expand what humanity can build.</p></div><div class="story-columns"><div><span class="kicker">The proof</span><h2>Texas is the starting point.</h2><p>Real machines, real projects, and people solving difficult construction problems. The campaign earns its ambition through the work.</p></div><div><span class="kicker">The horizon</span><h2>Mars is the direction.</h2><p>The capability to build on Earth lays the groundwork for building beyond it. Future-facing, grounded, and unapologetically ambitious.</p></div><div><span class="kicker">The invitation</span><h2>Build with us in Texas.</h2><p>A clear call to engineers and builders who want their work to matter in the physical world.</p></div></div><div class="crew-heading"><h2>One crew. Ten personalities.</h2><p>Shared chrome DNA. Different attitudes, silhouettes, and city cues.</p></div><div class="crew">{portraits}</div><div class="story-signoff"><strong>Mars starts with earthwork.</strong><span>Campaign platform</span></div>{fold('Explore the visual system and readability notes',PRODUCTION_NOTES)}'''

pilot=f'''<div class="page-heading"><div><span class="kicker">03 / The first test</span><h1>Start in Austin.<br><em>Keep the test focused.</em></h1></div><p>Two billboards. Four weeks. One clear invitation to build with us in Texas.</p></div><div class="pilot-layout"><div><button class="featured-board" data-city="austin" type="button" aria-label="Expand Austin billboard">{board(CITIES[0])}</button><div class="pilot-stats"><div><b>2</b><span>Billboard faces</span></div><div><b>4</b><span>Weeks of media</span></div><div><b>1</b><span>Austin test</span></div></div><p class="pilot-caption">Run the Austin concept on two standard static billboards. Connect the invitation to current Texas roles, then learn from traffic, candidate quality, and recruiting response.</p></div><aside class="budget-card"><span class="kicker">First Austin test · estimated</span><strong>{money(ATL)}–{money(ATH)}</strong><p>Includes media, production, artwork finalization, careers setup, reporting, and 15% contingency.</p><div class="budget-divider"></div><span class="kicker">Flight length</span><h2>Four weeks</h2><p>Dates and exact locations follow written quotes. This is a planning range, not a booked campaign.</p></aside></div><div class="test-scope"><span class="status">Build from here</span><p>Use the first result to decide what deserves more investment. The full Austin activation and Boston budgets are <a href="#budget-reference">saved separately for later ↗</a>.</p></div>{fold('See the five budget lines',table(AUSTIN)+BUDGET_NOTES+'<a class="text-link" href="downloads/terrafirma-pilot-budget.csv?v=5" download>Download the Austin test budget ↗</a>','budget')}{fold('See the simple test sequence',TIMELINE_NOTES,'timeline')}'''


reference_body=REFERENCE_NOTES+'<p><a class="text-link" href="downloads/terrafirma-expanded-budget-reference.csv?v=5" download>Download the preserved full-budget reference ↗</a></p><h3>Full Austin activation · future reference</h3>'+table(FULL_AUSTIN)+'<h3>Optional Boston expansion · future reference</h3>'+table(BOSTON)+f'<p>Original combined planning range: {money(FTL+BTL)}–{money(FTH+BTH)}. These scenarios are outside the first Austin test.</p>'
decision=f'''<div class="page-heading"><div><span class="kicker">04 / The recommendation</span><h1>A direction to believe in.<br><em>A first test to learn from.</em></h1></div><p>This is a proposal. Align on the creative direction, then quote a focused Austin test.</p></div><div class="decision-list"><div><span>01</span><div><h2>Back the creative direction.</h2><p>Texas-built ambition, a Mars horizon, and a distinctive local crew. Confirm the shared neon system and the city-specific character.</p></div></div><div><span>02</span><div><h2>Quote the first Austin test.</h2><p>Two static billboard faces for four weeks, using the existing Austin concept and careers destination. Confirm the all-in costs, locations, and timing.</p></div></div><div><span>03</span><div><h2>Learn, then build out the plan.</h2><p>Agree on candidate quality and acquisition-cost criteria before launch. Review the response and follow the funnel at 30, 60, and 90 days before developing a larger activation or another market.</p></div></div></div><div class="download-row"><a href="downloads/terrafirma-full-book.pdf?v=5"><span>01</span><strong>Four-page proposal</strong><small>The reviewer’s overview ↗</small></a><a href="downloads/terrafirma-billboards-edition.pdf?v=5"><span>02</span><strong>Billboards edition</strong><small>All ten concepts, expanded ↗</small></a><a href="downloads/terrafirma-pilot-budget.csv?v=5" download><span>03</span><strong>Austin test budget</strong><small>Five lines + contingency ↗</small></a></div>{fold('Saved for later: full activation and Boston budgets',reference_body,'budget-reference')}{fold('Explore measurement and delivery responsibilities',MEASURE_NOTES+'<p><strong>Brand + recruiting:</strong> creative, roles, the careers journey, and follow-up. <strong>Media owner + production:</strong> inventory, print proofs, posting, and removal. <strong>Finance + leadership:</strong> all-in quotes and the decision on a next test.</p>')}{fold('Sources and proposal status','<ul class="source-list">'+''.join(f'<li><a href="{u}" target="_blank" rel="noopener">{t} ↗</a></li>' for t,u in SOURCES)+'</ul><p class="quiet">Primary sources reviewed November 18, 2026. Media uses a published market benchmark; other budget lines are planning allowances. No inventory or vendors are booked. The original full budgets remain a separate reference. The official wordmark is sourced from TerraFirma; illustrations are AI-generated creative concepts.</p>')}'''


PANELS=[('campaign','The campaign',campaign),('brand','The story',brand),('pilot','The pilot',pilot),('decision','The recommendation',decision)]
CSS='''
@font-face{font-family:Shoulders;src:url(fonts/big-shoulders-900.ttf) format("truetype");font-weight:900;font-display:swap}
@font-face{font-family:Archivo;src:url(fonts/archivo-400.ttf) format("truetype");font-weight:400;font-display:swap}
@font-face{font-family:Archivo;src:url(fonts/archivo-700.ttf) format("truetype");font-weight:700;font-display:swap}
:root{--ink:#14182A;--bone:#EFEBE4;--paper:#E2DCD1;--orange:#FF823F;--muted:#B7B6BA;--line:#3D4251}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--ink);color:var(--bone);font:15px/1.55 Archivo,Arial,sans-serif}button,a,summary{-webkit-tap-highlight-color:transparent}button{font:inherit}a{color:inherit;text-underline-offset:4px}button{color:inherit;cursor:pointer}a:hover{text-decoration-thickness:2px}:focus-visible{outline:3px solid var(--orange);outline-offset:5px}img{display:block;max-width:100%;height:auto}h1,h2,h3{font-family:Shoulders,Impact,sans-serif;font-weight:900;line-height:1.02;text-transform:uppercase;margin:0;text-wrap:balance}h1{font-size:clamp(44px,4.6vw,70px);letter-spacing:.005em}h1 em{font-style:normal;color:var(--orange);text-shadow:0 0 20px #ff68132b}h2{font-size:30px}p{margin:0 0 16px;max-width:72ch}.wrap{width:min(1400px,100% - 64px);margin:auto}.quiet{color:var(--muted);font-size:12px}.kicker{display:block;font:11px/1.4 ui-monospace,Menlo,monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:12px}.masthead{position:sticky;top:0;z-index:20;background:var(--ink);border-bottom:1px solid var(--line)}.header-inner{display:flex;align-items:center;justify-content:space-between;gap:30px;height:75px}.brandmark img{width:170px;filter:brightness(0) invert(1)}.proposal-label{font:10px ui-monospace,monospace;letter-spacing:.12em;color:#FFB384}.review-nav{display:flex;gap:28px}.review-nav a{font-size:12px;text-decoration:none;padding:27px 0 22px;border-bottom:3px solid transparent;white-space:nowrap}.review-nav a[aria-selected=true]{color:#FFB384;border-bottom-color:var(--orange)}.panel{scroll-margin-top:110px;padding:32px 0 28px;min-height:calc(100vh - 145px)}.panel[hidden]{display:none}.page-heading{display:flex;align-items:end;justify-content:space-between;gap:40px;margin-bottom:28px}.page-heading>p{max-width:330px;font-size:16px;line-height:1.45;margin:0 0 4px}.page-heading .quiet{display:block;margin-top:10px}.board-wall{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:28px 26px}.tile{padding:0;border:0;background:transparent;text-align:left;min-width:0}.tile-caption{display:flex;align-items:center;justify-content:space-between;gap:6px;font-size:15px;margin-bottom:10px}.tile-caption i{font:10px ui-monospace,monospace;font-style:normal;color:#7B8192;margin-right:5px}.tile-status{font:9px ui-monospace,monospace;letter-spacing:.02em;color:#AEB2BC}.tile{cursor:zoom-in}.tile .billboard{border:1px solid #797579;transition:box-shadow .18s,transform .18s}.tile:hover .billboard,.tile:focus-visible .billboard{box-shadow:0 0 0 3px #FFA06A,0 0 38px #FF824B66;transform:translateY(-3px) scale(1.012)}.tile-meta{display:flex;align-items:center;gap:12px}.tile-zoom{display:inline-flex;align-items:center;gap:9px;padding:5px 10px;background:#FFB98E;color:#14182A;font-size:11px;font-weight:700;border-radius:2px}.tile-zoom b{font-size:18px;line-height:1}.tile:hover .tile-zoom,.tile:focus-visible .tile-zoom{background:#FFF2DF}.zoom-prompt{display:flex;align-items:center;gap:10px;color:#FFD5B5;font-size:13px;font-weight:700;margin-top:13px}.zoom-prompt>span{font-size:25px;line-height:1}.billboard{display:block;position:relative;width:100%;aspect-ratio:3/1;overflow:hidden;background:var(--bone)}.board-bg{position:absolute;width:100%;height:100%;object-fit:cover}.board-type{position:absolute;inset:0;width:100%;height:100%}.wall-note{max-width:none;width:100%;display:flex;justify-content:space-between;gap:20px;margin:22px 0 0;font:10px/1.5 ui-monospace,monospace;color:#9DA3B3}.page-footer{border-top:1px solid var(--line);padding:16px 0 18px}.footer-inner{display:flex;align-items:center;justify-content:space-between;gap:20px}.footer-inner a{font-size:12px;text-decoration:none}.footer-inner span{font:10px ui-monospace,monospace;color:#9299AA}.footer-inner a[aria-disabled=true]{opacity:.3;pointer-events:none}.story-columns{display:grid;grid-template-columns:repeat(3,1fr);gap:34px;margin-top:36px}.story-columns>div{border-top:1px solid #555965;padding-top:18px}.story-columns h2{margin-bottom:12px}.story-columns p{font-size:14px;color:#CFCCD0}.crew-heading{display:flex;justify-content:space-between;align-items:baseline;gap:20px;margin:34px 0 14px}.crew-heading h2{font-size:31px}.crew-heading p{font-size:12px;color:#AEB2BC;margin:0}.crew{display:grid;grid-template-columns:repeat(10,minmax(0,1fr));gap:9px}.portrait{border:0;background:none;padding:0;text-align:left;font-size:10px}.portrait-art{display:block;position:relative;overflow:hidden;aspect-ratio:3/4;background:var(--bone);border:1px solid #595F6E;margin-bottom:7px}.portrait img{max-width:none;width:auto;height:100%;position:absolute;left:-15%;top:0}.portrait:hover .portrait-art{border-color:var(--orange);box-shadow:0 0 14px #FF702C44}.story-signoff{display:flex;align-items:baseline;gap:20px;margin:24px 0 0}.story-signoff strong{font:900 38px/1.1 Shoulders;color:#FFAD74;text-transform:uppercase}.story-signoff span{font:10px ui-monospace,monospace;color:#9DA3B3}.fold{scroll-margin-top:125px;border-top:1px solid #545966;margin-top:24px}.fold>summary{display:flex;justify-content:space-between;align-items:center;gap:18px;padding:16px 0;cursor:pointer;list-style:none;font-size:13px;font-weight:700}.fold>summary::-webkit-details-marker{display:none}.fold>summary span{font-size:22px;font-weight:400;color:#FFB384}.fold[open]>summary span{font-size:0}.fold[open]>summary span:after{content:'−';font-size:22px}.fold-body{padding:5px 0 20px;max-width:1000px}.fold-body p{font-size:14px;max-width:90ch;color:#CFCCD0}.pilot-layout{display:grid;grid-template-columns:1.5fr 1fr;gap:34px;align-items:start}.featured-board{display:block;width:100%;padding:0;border:1px solid #666A76;background:none}.pilot-stats{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid #545966;padding:18px 0;margin-bottom:16px}.pilot-stats>div{display:flex;gap:12px;align-items:center}.pilot-stats b{font:900 50px/1 Shoulders;color:#FFB384}.pilot-stats span{font-size:12px;max-width:90px;color:#C9CCD4}.pilot-caption{font-size:14px;color:#C9CCD4}.budget-card{background:var(--bone);color:var(--ink);padding:25px 28px}.budget-card .kicker{color:#646875}.budget-card>strong{font:900 clamp(35px,3.7vw,55px)/1.1 Shoulders;display:block;margin-bottom:12px;white-space:nowrap}.budget-card p{font-size:13px;line-height:1.5;margin-bottom:0}.budget-divider{height:1px;background:#B6B0A4;margin:22px 0}.budget-card h2{font-size:32px;margin-bottom:10px}.test-scope{display:flex;gap:18px;align-items:start;background:#222839;padding:18px 22px;margin-top:20px}.test-scope p{font-size:13px;margin:0;max-width:none;color:#CCC9CC}.status{font:10px/1.5 ui-monospace,monospace;text-transform:uppercase;border:1px solid #797E8D;padding:4px 7px;white-space:nowrap;color:#FFB384}.decision-list{display:grid;gap:0;margin:34px 0 30px}.decision-list>div{display:grid;grid-template-columns:60px 1fr;gap:20px;padding:20px 0;border-top:1px solid #545966}.decision-list>div>span{font:900 38px/1 Shoulders;color:#FFB384}.decision-list h2{font-size:32px;margin-bottom:8px}.decision-list p{font-size:14px;color:#CCC9CC;max-width:95ch;margin:0}.download-row{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.download-row a{display:block;text-decoration:none;border:1px solid #555B6C;padding:18px 20px}.download-row a:hover{border-color:#FFB384}.download-row a>span{display:block;font:10px ui-monospace,monospace;color:#FFB384;margin-bottom:8px}.download-row strong{font:900 29px/1.1 Shoulders;text-transform:uppercase;display:block}.download-row small{font-size:12px;color:#B3B6C0;display:block;margin-top:8px}.table-scroll{overflow:auto;margin-bottom:20px}table{border-collapse:collapse;width:100%;font-size:13px}caption{text-align:left;font-size:12px;color:#B8BBC5;padding-bottom:14px}th{text-align:left;font:10px ui-monospace,monospace;letter-spacing:.06em;text-transform:uppercase;padding:10px 12px;border-bottom:1px solid #9A9EAB}td{padding:11px 12px;border-bottom:1px solid #454C5F}td small{display:block;color:#9DA3B3;font-size:11px;margin-top:3px}td:nth-child(n+2),th:nth-child(n+2){text-align:right;white-space:nowrap}.total{font-weight:700}.total:last-child{background:#2B3449;color:#FFE6CF}.plain-list{padding-left:20px}.plain-list li{font-size:14px;color:#CFCCD0;margin-bottom:13px}.source-list{padding-left:20px;columns:2;font-size:13px}.source-list li{margin-bottom:12px;break-inside:avoid}.text-link{font-size:13px;color:#FFB384}.viewer{position:fixed;inset:0;max-width:none;max-height:none;width:100%;height:100%;padding:0;border:0;background:#14182AF5;color:var(--bone);overflow:auto}.viewer::backdrop{background:#0A0C16}.viewer-shell{width:min(1480px,100% - 64px);margin:auto;padding:26px 0 40px}.viewer-bar{display:flex;align-items:center;justify-content:space-between;gap:24px;margin-bottom:24px}.viewer-bar h2{font-size:42px}.viewer-bar .kicker{margin-bottom:6px}.viewer-controls{display:flex;gap:9px}.control{background:none;border:1px solid #6F7482;padding:10px 14px;color:var(--bone);font-size:12px}.control:hover{background:#30384B}.viewer-board{border:1px solid #747784}.viewer-info{display:grid;grid-template-columns:1.1fr 1fr 1fr;gap:32px;margin-top:25px}.viewer-info h3{font-size:25px;margin:0 0 10px}.viewer-info p{font-size:13px;color:#C9CCD4}.viewer-links{display:flex;justify-content:space-between;gap:20px;font-size:12px;margin-top:22px;border-top:1px solid #596172;padding-top:18px}.viewer-links a{color:#FFB384}.viewer .fold{margin-top:16px}.viewer .fold-body{max-width:100%}.viewer[open]{display:block}.viewer:not([open]){display:none}body.modal-open{overflow:hidden}.no-script{padding:20px;border:1px solid #FFB384}.screen-only{} .print-only{display:none}
@media(min-width:1500px){.board-wall{gap:22px 26px}.page-heading{margin-bottom:32px}}
@media(max-width:1050px){.header-inner{height:auto;min-height:74px;flex-wrap:wrap;gap:0 28px;padding-top:18px}.review-nav{gap:20px}.review-nav a{padding:14px 0}.proposal-label{display:none}.page-heading>p{max-width:285px;font-size:14px}.board-wall{grid-template-columns:repeat(2,minmax(0,1fr))}.crew{grid-template-columns:repeat(5,1fr)}.portrait-art{aspect-ratio:3/4}.pilot-layout{grid-template-columns:1.25fr 1fr}.budget-card{padding:22px}.budget-card>strong{font-size:37px}.viewer-info{grid-template-columns:1fr 1fr}.viewer-info>div:first-child{grid-column:1/-1}.viewer-info>div:first-child p{max-width:90ch}}
@media(max-width:650px){.wrap{width:calc(100% - 32px)}.header-inner{display:block;padding-top:18px}.brandmark img{width:150px}.review-nav{gap:24px;overflow:auto}.review-nav a{font-size:11px;white-space:nowrap}.panel{padding-top:28px}.page-heading{display:block;margin-bottom:24px}.page-heading h1{font-size:48px}.page-heading>p{max-width:100%;margin:18px 0 0;font-size:14px}.page-heading .quiet{margin-top:7px}.board-wall{grid-template-columns:1fr;gap:22px}.tile-caption{font-size:13px}.tile-status{font-size:9px}.tile-meta{gap:9px}.tile-zoom{font-size:10px;padding:4px 8px}.wall-note{display:block;font-size:10px}.wall-note span{display:block;margin-bottom:6px}.story-columns{grid-template-columns:1fr;gap:20px}.story-columns h2{font-size:29px}.crew-heading{display:block}.crew-heading p{margin-top:8px}.crew{gap:12px 8px}.portrait{font-size:9px}.portrait-art{aspect-ratio:3/4}.story-signoff{display:block}.story-signoff strong{font-size:34px}.story-signoff span{display:block;margin-top:8px}.pilot-layout{grid-template-columns:1fr;gap:18px}.pilot-stats{padding:15px 0}.pilot-stats b{font-size:43px}.pilot-stats span{font-size:11px}.budget-card>strong{font-size:43px}.budget-card h2{font-size:30px}.test-scope{display:block;padding:18px}.test-scope .status{display:inline-block;margin-bottom:12px}.decision-list>div{grid-template-columns:35px 1fr;gap:15px}.decision-list h2{font-size:28px}.download-row{grid-template-columns:1fr}.viewer-shell{width:calc(100% - 28px);padding-top:18px}.viewer-bar{align-items:start;gap:10px}.viewer-bar h2{font-size:33px}.viewer-bar .kicker{font-size:9px}.control{padding:9px 10px;font-size:11px}.viewer-info{grid-template-columns:1fr;gap:18px}.viewer-info>div:first-child{grid-column:auto}.viewer-links{display:block}.viewer-links a{display:inline-block;margin-bottom:12px}.viewer-links span{display:block}.source-list{columns:1}.footer-inner{gap:10px}.footer-inner span{font-size:9px}.footer-inner a{font-size:11px}.fold>summary{font-size:12px}td,th{padding:10px 5px}table{font-size:12px}.table-scroll{width:100%}.quiet{font-size:11px}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.tile .billboard{transition:none}.tile:hover .billboard,.tile:focus-visible .billboard{transform:none}}
'''

MODALS={}
for c in CITIES:
    MODALS[c['id']]=f'''<div class="viewer-bar"><div><span class="kicker">{c['status']} / Creative concept</span><h2 id="viewer-title">{c['name']}</h2></div><div class="viewer-controls"><button type="button" class="control" data-step="-1" aria-label="Previous billboard">←</button><button type="button" class="control" data-step="1" aria-label="Next billboard">→</button><button type="button" class="control" data-close>Close ×</button></div></div><div class="viewer-board">{board(c,False)}</div><div class="viewer-info"><div><h3>{' '.join(c['lines'])}</h3><p>{c['reason']}</p></div><div><h3>{c['character']}</h3><p>{c['character_detail']}</p></div><div><h3>The city, in a few strokes.</h3><p>{c['skyline']} A visible rocket and working excavator connect the local horizon to the larger mission.</p></div></div>{fold('More on the audience and proposed placement',f'<p><strong>Audience:</strong> {c["role"]}</p><p><strong>Placement:</strong> {c["placement"]}</p><p><strong>Proof:</strong> {c["proof"]}</p>')}<div class="viewer-links"><a href="downloads/billboard-{c['id']}.svg?v=5" target="_blank" rel="noopener">Open full-size concept ↗</a><span>3:1 concept · Proposal artwork · Final vendor proof required</span></div>'''

JS='''
(()=>{
 const pages=['campaign','brand','pilot','decision'];
 const names=['The campaign','The story','The pilot','The recommendation'];
 const cityIds=Object.keys(window.campaignViews);
 const dialog=document.querySelector('#city-viewer');
 const shell=document.querySelector('#viewer-content');
 let active='campaign', currentCity=null, returnFocus=null;
 function showPage(id){
  active=id;
  for(const p of pages){document.querySelector('#'+p).hidden=p!==id;const tab=document.querySelector('#tab-'+p);tab.setAttribute('aria-selected',String(p===id));tab.tabIndex=p===id?0:-1;}
  const n=pages.indexOf(id);
  const prev=document.querySelector('#previous-page'), next=document.querySelector('#next-page');
  prev.href='#'+pages[Math.max(0,n-1)];prev.textContent=n?'← '+names[n-1]:'← Previous';prev.setAttribute('aria-disabled',String(n===0));prev.tabIndex=n===0?-1:0;
  next.href='#'+pages[Math.min(3,n+1)];next.textContent=n<3?names[n+1]+' →':'Back to campaign ↗';if(n===3)next.href='#campaign';
  document.querySelector('#page-count').textContent=String(n+1).padStart(2,'0')+' / 04 · Creative proposal';
 }
 function closeViewer(updateHash=true){
  const wasOpen=dialog.open;if(wasOpen)dialog.close();document.body.classList.remove('modal-open');currentCity=null;
  if(updateHash)history.replaceState(null,'','#'+active);
  if(wasOpen&&returnFocus&&document.contains(returnFocus))returnFocus.focus({preventScroll:true});
 }
 function openCity(id){
  if(!currentCity)returnFocus=document.activeElement;
  currentCity=id;shell.innerHTML=window.campaignViews[id];
  document.body.classList.add('modal-open');
  if(!dialog.open)dialog.showModal();
  dialog.scrollTop=0;shell.querySelector('[data-close]').focus({preventScroll:true});
 }
 function route(){
  const hash=location.hash.slice(1)||'campaign';
  if(cityIds.includes(hash)){if(!pages.includes(active))showPage('campaign');openCity(hash);return;}
  closeViewer(false);
  const aliases={top:'campaign',cities:'campaign',story:'brand',system:'brand',budget:'pilot',timeline:'pilot',execution:'decision',downloads:'decision',measurement:'decision','budget-reference':'decision'};
  const page=pages.includes(hash)?hash:(aliases[hash]||'campaign');showPage(page);
  if(hash==='budget'||hash==='timeline'||hash==='budget-reference'){const detail=document.querySelector('#'+hash);detail.open=true;detail.scrollIntoView({block:'start',behavior:'instant'});}
  else window.scrollTo({top:0,behavior:'instant'});
 }
 document.addEventListener('click',e=>{
  const city=e.target.closest('[data-city]');
  if(city){returnFocus=city;if(location.hash==='#'+city.dataset.city)openCity(city.dataset.city);else location.hash=city.dataset.city;}
  if(e.target.closest('[data-close]'))closeViewer();
  const step=e.target.closest('[data-step]');
  if(step&&currentCity){const next=(cityIds.indexOf(currentCity)+Number(step.dataset.step)+cityIds.length)%cityIds.length;location.hash=cityIds[next];}
 });
 dialog.addEventListener('cancel',e=>{e.preventDefault();closeViewer();});
 dialog.addEventListener('click',e=>{if(e.target===dialog)closeViewer();});
 document.querySelector('.review-nav').addEventListener('keydown',e=>{
  if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();let n=pages.indexOf(active);
  n=e.key==='Home'?0:e.key==='End'?3:(n+(e.key==='ArrowRight'?1:-1)+4)%4;
  location.hash=pages[n];document.querySelector('#tab-'+pages[n]).focus();
 });
 document.addEventListener('keydown',e=>{
  if(!dialog.open||!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();const n=(cityIds.indexOf(currentCity)+(e.key==='ArrowRight'?1:-1)+cityIds.length)%cityIds.length;location.hash=cityIds[n];
 });
 window.addEventListener('hashchange',route);showPage('campaign');route();
})();
'''
head='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="description" content="A four-page TerraFirma campaign proposal: ten city concepts, one cohesive brand world, and an Austin pilot."><title>TerraFirma — Campaign Proposal</title><link rel="stylesheet" href="campaign.css?v=5"></head>'''
nav='<header class="masthead"><div class="wrap header-inner"><a class="brandmark" href="#campaign" aria-label="TerraFirma campaign overview"><img src="img/v3/official-logo-1.svg" alt="TerraFirma" width="1164" height="144"></a><span class="proposal-label">CREATIVE PROPOSAL / V5</span><nav class="review-nav" aria-label="Proposal pages" role="tablist">'+''.join(f'<a role="tab" id="tab-{pid}" href="#{pid}" aria-controls="{pid}" aria-selected="{str(i==0).lower()}" tabindex="{0 if i==0 else -1}">{i+1:02d} {["Campaign","Story","Pilot","Decision"][i]}</a>' for i,(pid,name,body) in enumerate(PANELS))+'</nav></div></header>'
content='<main class="wrap">'+''.join(f'<section class="panel" role="tabpanel" aria-labelledby="tab-{pid}" id="{pid}">{body}</section>' for pid,name,body in PANELS)+'</main>'
footer='<footer class="page-footer"><div class="wrap footer-inner"><a href="#campaign" id="previous-page">← Previous</a><span id="page-count">01 / 04 · Creative proposal</span><a href="#brand" id="next-page">The story →</a></div></footer>'
viewer='<dialog class="viewer" id="city-viewer" aria-labelledby="viewer-title"><div class="viewer-shell" id="viewer-content"></div></dialog>'
(OUT/'index.html').write_text(head+'<body>'+nav+content+footer+viewer+'<script src="campaign-views.js?v=5"></script><script src="campaign.js?v=5"></script></body></html>\n')
(OUT/'campaign.css').write_text(CSS)
(OUT/'campaign.js').write_text(JS)
(OUT/'campaign-views.js').write_text('window.campaignViews='+json.dumps(MODALS).replace('</','<\\/')+';\n')

# The main reviewer export is deliberately four pages. Detailed artwork remains
# available in a separate edition, and operational detail stays in disclosures.
PRINT_CSS='''@page{size:1440px 1080px;margin:0}html,body{background:#14182A;margin:0}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}.print-page{width:1440px;height:1080px;padding:42px 56px 65px;position:relative;overflow:hidden;break-after:page;page-break-after:always}.print-page:last-child{break-after:auto;page-break-after:auto}.print-page .page-heading{margin-bottom:28px}.print-page h1{font-size:67px}.print-page .page-heading>p{font-size:17px}.print-page .board-wall{grid-template-columns:repeat(2,minmax(0,1fr));max-width:920px;margin:0 auto;gap:8px 20px}.print-page .tile,.print-page .portrait,.print-page .featured-board{text-decoration:none;color:inherit}.print-page .tile{display:block}.print-page .tile .billboard{border:0}.print-page .tile-caption{font-size:12px;line-height:1.2;margin-bottom:4px}.print-page .tile-status{font-size:9px}.print-page .tile-zoom{display:none}.print-page .wall-note{font-size:10px;margin-top:12px}.print-page:first-child{padding-top:28px}.print-page:first-child .page-heading{margin-bottom:12px}.print-page:first-child h1{font-size:48px}.print-page:first-child .page-heading>p{font-size:13px}.print-page:first-child .kicker{font-size:10px;margin-bottom:6px}.print-page:first-child .zoom-prompt{font-size:11px;margin-top:6px}.print-page:first-child .zoom-prompt>span{font-size:17px}.print-page .crew{margin-top:28px}.print-page .portrait-art{aspect-ratio:3/4}.print-page .story-columns{margin-top:44px}.print-page .story-columns p{font-size:17px}.print-page .story-columns h2{font-size:36px}.print-page .crew-heading{margin-top:48px}.print-page .story-signoff{margin-top:35px}.print-page .fold{display:none}.print-page .pilot-layout{margin-top:44px}.print-page .pilot-caption{font-size:17px}.print-page .budget-card p{font-size:16px}.print-page .pilot-stats span{font-size:15px}.print-page .test-scope{margin-top:36px;padding:25px}.print-page .test-scope p{font-size:17px}.print-page .decision-list{margin:46px 0 36px}.print-page .decision-list>div{padding:28px 0}.print-page .decision-list p{font-size:18px}.print-page .decision-list h2{font-size:38px}.print-page .download-row{margin-top:36px}.print-page .print-note{font-size:15px;color:#C4C7D0;margin-top:28px;max-width:100%}.print-footer{position:absolute;bottom:28px;left:56px;right:56px;display:flex;justify-content:space-between;border-top:1px solid #545966;padding-top:12px;color:#AEB2BC;font-size:11px}.print-page .portrait{pointer-events:none}.print-page .viewer-info{margin-top:34px}.print-page .viewer-info p{font-size:17px}.print-page .viewer-info h3{font-size:32px}.print-page .viewer-board{margin-top:30px}.print-page .viewer-links{font-size:14px;margin-top:30px}.print-page .print-city-head{display:flex;justify-content:space-between;align-items:end}.print-page .print-city-head h1{font-size:72px}.print-page .kicker{font-size:12px}.print-page .tile-caption i{font-size:11px}'''

def print_page(body,n,total):
    return f'<article class="print-page"><div class="print-content">{body}</div><div class="print-footer"><span>TerraFirma · {VERSION} · Proposal</span><span>{n:02d} / {total:02d}</span></div></article>'
def remove_folds(s): return re.sub(r'<details\b.*?</details>','',s,flags=re.S)
def print_document(pages,title):
    body=''.join(print_page(b,i+1,len(pages)) for i,b in enumerate(pages))
    body=re.sub(r'<button\b([^>]*)data-city="([^"]+)"([^>]*)>',r'<a\1href="https://jacklesser.me/terrafirma_billboard_campaign/#\2"\3>',body).replace('</button>','</a>')
    body=body.replace('href="#budget-reference"','href="https://jacklesser.me/terrafirma_billboard_campaign/#budget-reference"')
    body=body.replace('href="downloads/','href="https://jacklesser.me/terrafirma_billboard_campaign/downloads/')
    return head.replace('campaign.css?v=5','campaign.css').replace('Campaign Proposal',title).replace('</head>',f'<style>{PRINT_CSS}</style></head>')+'<body>'+body+'</body></html>'

print_panels=[remove_folds(body) for pid,name,body in PANELS]
print_panels[2]+='<p class="print-note"><strong>Proposed sequence:</strong> confirm roles and inventory → approve artwork and tracking → run for four weeks → review the response and follow the candidate funnel. Dates follow quotes. The five-line budget is for this Austin test only; larger activation budgets are preserved separately. Internal team time is outside this cash estimate.</p>'
print_panels[3]+='<p class="print-note">Review expanded city concepts, production notes, measurement, source links, and the itemized budget at <a href="https://jacklesser.me/terrafirma_billboard_campaign/">jacklesser.me/terrafirma_billboard_campaign/</a>. Current company capabilities: <a href="https://terrafirma.inc/">terrafirma.inc</a>.</p>'
(OUT/'print-full.html').write_text(print_document(print_panels,'Four-page campaign proposal'))
expanded=[campaign]
for c in CITIES:
    expanded.append(f'<div class="print-city-head"><div><span class="kicker">{c["status"]} / Creative concept</span><h1>{c["name"]}</h1></div><span class="status">{c["character"]}</span></div><div class="viewer-board">{board(c,False)}</div><div class="viewer-info"><div><h3>{" ".join(c["lines"])}</h3><p>{c["reason"]}</p></div><div><h3>Character</h3><p>{c["character_detail"]}</p></div><div><h3>City cues</h3><p>{c["skyline"]} The rocket connects the local horizon to the Mars ambition.</p></div></div><p class="print-note"><strong>Audience:</strong> {c["role"]}.<br><strong>Proposed placement:</strong> {c["placement"]}</p><div class="viewer-links"><a href="downloads/billboard-{c["id"]}.svg?v=5">Open full-size concept ↗</a><span>3:1 concept · Final vendor proof required</span></div>')
expanded.append('<span class="kicker">The shared system</span><h1>Character, place,<br><em>and a clear invitation.</em></h1><div style="margin-top:40px;font-size:20px">'+PRODUCTION_NOTES+'</div><p class="print-note">The operator, city skyline, rocket, excavator, and neon lettering are proposal illustrations. Verify current roles, final production requirements, and actual viewing conditions before launch.</p>')
(OUT/'print-billboards.html').write_text(print_document(expanded,'Billboards edition'))
print(f'Built four-page proposal, ten neon SVG masters, budget CSV, and {len(expanded)}-page expanded artwork edition.')
