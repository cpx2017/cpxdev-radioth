import React from 'react';
import Fet from '../fetch'

    const Home = ({obj, setLoad, StillLoad}) => {
            const [news, setNews] = React.useState([])
        React.useEffect(() => {
            var dem = setInterval(function(){ 
                if (Fet().ul !== '') {
                  clearInterval(dem)
                  setLoad(true)
                  if (Object.keys(obj).length == 0) {
                    fetch(Fet().ul + '/radio/getnews?art=thai entertaimnent')
                    .then(res => res.json())
                    .then(data => {
                        if (data.rss.channel.item != undefined) {
                            setNews(data.rss.channel.item)
                        }
                        if (!StillLoad) {
                            setLoad(false)
                        }
                    }).catch(() => {
                        if (!StillLoad) {
                            setLoad(false)
                        }
                    })
                    } else {
                        fetch(Fet().ul + '/radio/getnews?art=' + obj.artShort)
                    .then(res => res.json())
                    .then(data => {
                        if (data.rss.channel.item != undefined) {
                            setNews(data.rss.channel.item)
                        }
                        if (!StillLoad) {
                            setLoad(false)
                        }
                    }).catch(() => {
                        if (!StillLoad) {
                            setLoad(false)
                        }
                    })
                    }
                }
            }, 10);
        }, [])
        return ( 
            <div class="card-body">
                <h5 class="card-title">Welcome to new RadioTH</h5>
                <hr />
                <p>Let's see fresh news today below</p>
                {news.length > 0 ? news.map((it, i) => i < 20 && (
                    <div class="card mb-5" key={i}>
                    <h5 class="card-header">{it.title}</h5>
                    <div class="card-body" dangerouslySetInnerHTML={{__html: it.description}}>
                    </div>
                    </div>
                )) : (
                    <div className='text-center'>
                        No news update or please wait
                    </div>
                )}
                
                <p className='text-muted text-center mt-3'>Powered by Google News</p>
            </div>
         );
    }
     
    export default Home;