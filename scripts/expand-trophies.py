"""Extend the three activity trophies with verified public GitHub metadata.

The upstream trophy fetcher can silently drop repository-query errors. This
collector paginates the public REST endpoint and fails on incomplete responses.
The existing three cards are preserved. Added rank thresholds and cup artwork
follow soulteary/github-profile-trophy v1.0.0 (MIT; see assets/trophies/LICENSE).
"""
import argparse
from copy import deepcopy
from datetime import datetime, timezone
import json
import os
from pathlib import Path
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
USER = 'amananurag20'
API = 'https://api.github.com'
NS = 'http://www.w3.org/2000/svg'
ET.register_namespace('', NS)
S = '{' + NS + '}'
RANKS = {
    'Stars': [(2000,'SSS','Super Stargazer'),(700,'SS','High Stargazer'),(200,'S','Stargazer'),(100,'AAA','Super Star'),(50,'AA','High Star'),(30,'A','You are a Star'),(10,'B','Middle Star'),(1,'C','First Star')],
    'Repositories': [(50,'SSS','God Repo Creator'),(45,'SS','Deep Repo Creator'),(40,'S','Super Repo Creator'),(35,'AAA','Ultra Repo Creator'),(30,'AA','Hyper Repo Creator'),(20,'A','High Repo Creator'),(10,'B','Middle Repo Creator'),(1,'C','First Repository')],
    'Experience': [(70,'SSS','Seasoned Veteran'),(55,'SS','Grandmaster'),(40,'S','Master Dev'),(28,'AAA','Expert Dev'),(18,'AA','Experienced Dev'),(11,'A','Intermediate Dev'),(6,'B','Junior Dev'),(2,'C','Newbie')],
}


def get_json(path):
    headers = {'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','User-Agent':'AmanProfileTrophies/1.0'}
    if os.environ.get('GITHUB_TOKEN'):
        headers['Authorization'] = 'Bearer ' + os.environ['GITHUB_TOKEN']
    with urlopen(Request(API+path,headers=headers),timeout=30) as response:
        return json.load(response)


def collect(cached):
    if cached:
        user = json.loads((cached/'trophy-public-user.json').read_text())
        repos = json.loads((cached/'trophy-repos.json').read_text())
    else:
        user = get_json('/users/'+USER)
        repos = []
        for page in range(1,101):
            batch = get_json(f'/users/{USER}/repos?type=owner&per_page=100&page={page}')
            if not isinstance(batch,list):raise ValueError('Repository request did not return a list')
            repos.extend(batch)
            if len(batch)<100:break
        else:raise ValueError('Repository pagination exceeded its limit')
    if user.get('login','').lower()!=USER or type(user.get('public_repos')) is not int:
        raise ValueError('Unexpected GitHub account response')
    if len(repos)!=user['public_repos'] or len({r['id'] for r in repos})!=len(repos):
        raise ValueError('Repository count changed during collection or pagination is incomplete; retry later')
    if any(r.get('private') or r['owner']['login'].lower()!=USER or type(r.get('stargazers_count')) is not int for r in repos):
        raise ValueError('Unexpected repository metadata')
    created = datetime.fromisoformat(user['created_at'].replace('Z','+00:00'))
    now = datetime.now(timezone.utc)
    age_days = (now-created).days
    if age_days<0:raise ValueError('Invalid account creation date')
    return {'as_of':now.date().isoformat(),'sources':[API+'/users/'+USER,API+'/users/'+USER+'/repos?type=owner'],
        'Stars':sum(r['stargazers_count'] for r in repos),'Repositories':len(repos),
        'Experience':age_days//100,'account_created_at':user['created_at'],
        'experience_definition':'floor(GitHub account age in days / 100); not employment experience'}


def rank_for(category,score):
    for i,(minimum,rank,label) in enumerate(RANKS[category]):
        if score>=minimum:
            next_minimum = RANKS[category][i-1][0] if i else None
            progress = 1 if next_minimum is None else (score-minimum)/(next_minimum-minimum)
            return rank,label,max(0,min(1,progress))
    raise ValueError(f'{category} has no earned rank')


def add_text(card,y,text,size=10.5,fill='#a9fef7'):
    element=ET.SubElement(card,S+'text',{'x':'55','y':str(y),'text-anchor':'middle','font-family':'Segoe UI,Helvetica,Arial,sans-serif','font-weight':'bold','font-size':str(size),'fill':fill})
    element.text=text


def new_card(template,category,score):
    rank,label,progress=rank_for(category,score)
    card=ET.Element(S+'svg',{'width':'110','height':'110','viewBox':'0 0 110 110','fill':'none'})
    ET.SubElement(card,S+'rect',{'x':'.5','y':'.5','width':'109','height':'109','rx':'4.5','fill':'#141321'})
    # Reuse the MIT cup path artwork, with an explicit earned rank in the medal.
    laurel=next(e for e in template.findall(S+'svg') if e.get('viewBox')=='0 0 100 100')
    card.append(deepcopy(laurel))
    cup=deepcopy(next(e for e in template.findall(S+'svg') if e.get('width')=='100'))
    cup.set('fill','#ffce32' if rank.startswith('S') else '#8df7b5')
    for text in cup.iter(S+'text'):
        text.text=rank
        text.set('x','8')
        text.set('text-anchor','middle')
        text.set('font-size','4.3' if len(rank)==3 else '5.7' if len(rank)==2 else '7')
        text.set('fill','#965b16' if rank.startswith('S') else '#3a3a3a')
    card.append(cup)
    add_text(card,18,category,13,'#fe428e')
    add_text(card,85,label,9.5 if len(label)>15 else 10.5)
    add_text(card,97,f'{score:,}pt',10)
    ET.SubElement(card,S+'rect',{'x':'15','y':'101','width':'80','height':'3.2','rx':'1','fill':'#fe428e','opacity':'.3'})
    ET.SubElement(card,S+'rect',{'x':'15','y':'101','width':f'{80*progress:.2f}','height':'3.2','rx':'1','fill':'#fe428e'})
    return card


def expand(data):
    original=ET.parse(ROOT/'profile/trophy.svg').getroot()
    cards={}
    for card in original.findall(S+'svg'):
        labels=card.findall(S+'text')
        if labels:cards[labels[0].text]=card
    required=['Commits','PullRequest','Followers']
    if any(name not in cards for name in required):raise ValueError('Expected three valid source trophy cards')
    output=ET.Element(S+'svg',{'width':'346','height':'228','viewBox':'0 0 346 228','fill':'none','role':'img','aria-labelledby':'trophy-title trophy-desc'})
    ET.SubElement(output,S+'title',{'id':'trophy-title'}).text='GitHub trophies: commits, pull requests, followers, stars, repositories, and account experience'
    ET.SubElement(output,S+'desc',{'id':'trophy-desc'}).text=f"Public GitHub metadata checked {data['as_of']}. Stars {data['Stars']}; public repositories {data['Repositories']}; account duration {data['Experience']} points. Experience is account age, not employment experience."
    all_cards=[deepcopy(cards[name]) for name in required]+[new_card(cards['Followers'],name,data[name]) for name in ['Stars','Repositories','Experience']]
    for i,card in enumerate(all_cards):
        card.set('x',str((i%3)*118));card.set('y',str((i//3)*118));output.append(card)
    content=ET.tostring(output,encoding='unicode')+'\n'
    ET.fromstring(content)
    (ROOT/'profile/trophy.svg').write_text(content)
    (ROOT/'profile/trophy-data.json').write_text(json.dumps(data,indent=2)+'\n')
    print(f"Expanded to six trophies: {data['Stars']} stars, {data['Repositories']} public repositories, {data['Experience']} account-age points.")


if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--cached',type=Path)
    expand(collect(parser.parse_args().cached))
