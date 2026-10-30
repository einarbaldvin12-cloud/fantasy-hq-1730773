module.exports = async (req,res) => {
  const type=req.query.type;
  const entry=String(req.query.entry||'');
  const event=String(req.query.event||'');
  const leagueId='1730773';
  
  const routes={
    league:'https://fantasy.premierleague.com/api/leagues-classic/'+leagueId+'/standings/?page_standings=1',
    bootstrap:'https://fantasy.premierleague.com/api/bootstrap-static/'
  };
  let url=routes[type];
  if(type==='live' && /^[0-9]{1,2}$/.test(event)) url='https://fantasy.premierleague.com/api/event/'+event+'/live/';
  if(type==='transfers' && /^\d{1,10}$/.test(entry)) url='https://fantasy.premierleague.com/api/entry/'+entry+'/transfers/';
  if(type==='history' && /^\d{1,10}$/.test(entry)) url='https://fantasy.premierleague.com/api/entry/'+entry+'/history/';
  if(type==='entry' && /^\d{1,10}$/.test(entry) && /^\d{1,2}$/.test(event)) url='https://fantasy.premierleague.com/api/entry/'+entry+'/event/'+event+'/picks/';
  if(!url) return res.status(400).json({error:'Ógild beiðni'});
  try{
    const upstream=await fetch(url,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(8000)});
    if(!upstream.ok)return res.status(502).json({error:'FPL svaraði '+upstream.status});
    res.setHeader('Cache-Control','s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(await upstream.json());
  }catch(e){return res.status(502).json({error:'FPL tenging mistókst'})}
};