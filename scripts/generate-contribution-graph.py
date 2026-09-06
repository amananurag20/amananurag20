"""Plot the last 31 days from GitHub's public contribution calendar.

No token or third-party chart service is needed. Fail on missing or malformed
calendar data so a failed refresh never replaces the last good graph with zeros.
Use --html /path/to/calendar.html to reproduce from a saved GitHub response.
"""
import argparse
from datetime import date, datetime, timedelta, timezone
from html.parser import HTMLParser
import json
from pathlib import Path
import re
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.ticker import MaxNLocator

ROOT = Path(__file__).resolve().parents[1]
SOURCE = 'https://github.com/users/amananurag20/contributions'

class CalendarParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.days = {}
        self.labels = {}
        self.current = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'td' and attrs.get('data-date'):
            self.days[attrs['id']] = attrs['data-date']
        if tag == 'tool-tip' and attrs.get('for'):
            self.current = attrs['for']
            self.labels[self.current] = ''

    def handle_data(self, data):
        if self.current:
            self.labels[self.current] += data

    def handle_endtag(self, tag):
        if tag == 'tool-tip':
            self.current = None

    def records(self):
        rows = []
        for key, day in self.days.items():
            match = re.match(r'^(No|[\d,]+) contributions? on ', self.labels.get(key, '').strip())
            if not match:
                raise ValueError(f'Missing contribution count for {day}')
            count = 0 if match[1] == 'No' else int(match[1].replace(',', ''))
            rows.append({'date': date.fromisoformat(day).isoformat(), 'count': count})
        rows.sort(key=lambda row: row['date'])
        if len(rows) < 31 or len({row['date'] for row in rows}) != len(rows):
            raise ValueError('Incomplete or duplicate contribution calendar')
        rows = rows[-31:]
        start = date.fromisoformat(rows[0]['date'])
        if any(row['date'] != (start + timedelta(days=i)).isoformat() for i, row in enumerate(rows)):
            raise ValueError('Contribution calendar has gaps')
        if abs((date.today() - date.fromisoformat(rows[-1]['date'])).days) > 1:
            raise ValueError('Contribution calendar is not current')
        return rows


def render(rows, theme):
    dark = theme == 'dark'
    bg, ink, muted, grid, accent = ('#0d1117', '#f0f6fc', '#a6b0bd', '#30363d', '#ffa36c') if dark else ('#ffffff', '#171b23', '#59636f', '#e6e9ed', '#c64b1e')
    plt.rcParams.update({'font.family':'DejaVu Sans', 'svg.fonttype':'none', 'svg.hashsalt':'aman-contribution-graph', 'font.size':11})
    fig, ax = plt.subplots(figsize=(12, 4.15), dpi=100)
    fig.patch.set_facecolor(bg)
    ax.set_facecolor(bg)
    fig.subplots_adjust(left=.075, right=.975, bottom=.21, top=.72)
    counts = [row['count'] for row in rows]
    total, active = sum(counts), sum(count > 0 for count in counts)
    fig.text(.027,.915,'Contribution activity',color=ink,size=21,weight='bold')
    fig.text(.027,.82,f'{total:,} contributions  /  {active} active days  /  last 31 days',color=muted,size=12)
    ax.plot(range(31),counts,color=accent,lw=2.4,marker='o',markersize=4,markeredgecolor=bg,markeredgewidth=.7,zorder=3)
    ax.fill_between(range(31),counts,color=accent,alpha=.09)
    ax.set_xlim(-.3,30.3)
    ax.set_ylim(0,max(5,max(counts)*1.18))
    ax.yaxis.set_major_locator(MaxNLocator(nbins=4,integer=True))
    ax.grid(axis='y',color=grid,lw=.8)
    for spine in ax.spines.values():spine.set_visible(False)
    ax.tick_params(axis='both',length=0,colors=muted,pad=10,labelsize=10)
    ticks = [0,5,10,15,20,25,30]
    ax.set_xticks(ticks,[date.fromisoformat(rows[i]['date']).strftime('%b %d') for i in ticks])
    fig.text(.027,.042,f"Source: GitHub public profile calendar · Through {rows[-1]['date']} · Today may be incomplete",color=muted,size=9)
    out = ROOT/'profile'/f'activity-{theme}.svg'
    fig.savefig(out,format='svg',metadata={'Date':None,'Creator':'Matplotlib; generate-contribution-graph.py'})
    plt.close(fig)
    # Text remains selectable; expose the chart summary to image readers too.
    text = out.read_text()
    title = f'GitHub contributions: {rows[0]["date"]} to {rows[-1]["date"]}; {total} contributions across {active} active days'
    text = text.replace('<defs>',f'<title>{title}</title><desc>Daily counts, plotted from the public GitHub contribution calendar. Source data: contributions.json.</desc><defs>',1)
    ET.fromstring(text)
    out.write_text(text)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--html',type=Path)
    args = parser.parse_args()
    if args.html:
        source = args.html.read_text()
    else:
        request = Request(SOURCE,headers={'User-Agent':'AmanProfileActivity/1.0','Accept-Language':'en-US'})
        with urlopen(request,timeout=30) as response:
            if response.status != 200:raise RuntimeError('GitHub calendar request failed')
            source = response.read().decode('utf-8')
    calendar = CalendarParser()
    calendar.feed(source)
    rows = calendar.records()
    (ROOT/'profile').mkdir(exist_ok=True)
    for theme in ['light','dark']:render(rows,theme)
    (ROOT/'profile'/'contributions.json').write_text(json.dumps({'source':SOURCE,'through':rows[-1]['date'],'days':rows},indent=2)+'\n')
    print(f"Generated 31 daily observations through {rows[-1]['date']}; total {sum(row['count'] for row in rows)}.")

if __name__ == '__main__':main()
