import logo from './logo.svg';
import './App.css';
import React, { Component }  from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";
import Select from 'react-select'
import $ from 'jquery'
import 'sweetalert2/dist/sweetalert2.min.css';
import 'hamburgers/dist/hamburgers.min.css'
import Swal from 'sweetalert2/dist/sweetalert2';
import { AppBar, Toolbar,Typography, IconButton, Drawer, FormControlLabel, ListItem, ListItemIcon, Divider, ListItemText,
  Dialog, DialogActions, Button, DialogTitle, DialogContent, Avatar, Badge, CardContent, CardMedia, Slide } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import HomeIcon from '@material-ui/icons/Home';
import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';
import PeopleIcon from '@material-ui/icons/People';
import ListAltIcon from '@material-ui/icons/ListAlt';
import RadioIcon from '@material-ui/icons/Radio';
import InfoIcon from '@material-ui/icons/Info';
import PublicIcon from '@material-ui/icons/Public';

import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';

import Home from './page/home'
import Info from './page/info'
import TopSong from './page/topsong'
import Abo from './page/about'

import Fet from './fetch'

var myInterval;
var audioCom = new Audio();
var de;
var playstat = false;
const array1 = ["sun"];

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  search: {
    right: theme.spacing(1),
    position: 'absolute',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
}));

const App = () => {
  const cls = useStyles();
  const [ btn, setBtn ] = React.useState({
    play: true,
    pause: false,
    stop: false
  })
  const His = useHistory()
  const [ streamurl, setStreamuri ] = React.useState('https://cdn.jsdelivr.net/gh/cpx2017/cpxcdnbucket@main/radioth/White-square.webp')
  const [ region, setRegion ] = React.useState('Loading')
  const [ choosenstation, setStation ] = React.useState({})
  const [ objData, setObj ] = React.useState({})
  const [open, setOpen] = React.useState(false);
  
  const [ MainLoad, setLoad ] = React.useState(true)

  function iOS() {
    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform)
        // iPad on iOS 13 detection
        || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

  const forceerror = () => {
    clearInterval(myInterval);
    setLoad(false)
    document.title = "Streaming server is not responding"
    setObj({})
    setStreamuri('')
    playstat = false
    audioCom.pause();
    audioCom.currentTime = 0;
    
    setBtn({...btn, play: true, pause: false, stop: false})
  
    clearInterval(myInterval);
    $('#playbtn').show()
    Swal.fire(
      'พบข้อผิดพลาด',
      'การสตรีมมิ่งวิทยุมีปัญหาชั่วคราว กรุณาลองใหม่ในภายหลัง',
      'error'
    )
  }

  React.useEffect(() => {
    var dem = setInterval(function(){ 
        if (Fet().ul !== '') {
          clearInterval(dem)
          setLoad(false)
            setRegion(Fet().nme)
        }
    }, 10);
  }, [])



  const pauseStream = () => {
    clearInterval(myInterval);
    playstat = false
    setBtn({...btn, play: true, pause: false, stop: true})
    audioCom.pause();
    setStreamuri('https://cdn.jsdelivr.net/gh/cpx2017/cpxcdnbucket@main/radioth/White-square.webp')
    setObj({})
    document.title = '[Pause Radio] RadioTH - New Era'
  }

  const stopStream = () => {
    clearInterval(myInterval);
    playstat = false
    setBtn({...btn, play: true, pause: false, stop: false})
    audioCom.pause();
    audioCom.currentTime = 0
    setStreamuri('https://cdn.jsdelivr.net/gh/cpx2017/cpxcdnbucket@main/radioth/White-square.webp')
    setObj({})
    document.title = 'RadioTH - New Era'
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new window.MediaMetadata();
  }
  audioCom = ''
  }


  const LoopAPI = () => {
    setLoad(true)
    $.ajax({
      url: Fet().ul + "/radio/apiloop?station=" + choosenstation.value,
      type: "GET",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      error: function () {
          forceerror()
      },
      success: function (r) {
        setLoad(false)
          if (playstat == true) {
            playstat = true;
            setObj(r)
            let imgtemp;
            if (r.img == '') {
              imgtemp = 'https://cdn.jsdelivr.net/gh/cpx2017/cpxcdnbucket@main/radioth/favicon.webp'
            } else {
                imgtemp = r.img
            }
            setStreamuri(imgtemp)
            if (iOS() == true) {
              document.title = "You listening to " + r.radioname + ". (Sorry, But song metadata is not support on IOS Device)"
            } else {
              document.title = r.title + " | " + r.artist + " [" + r.radioname +"]"
            }
            if ('mediaSession' in navigator) {
                navigator.mediaSession.metadata = new window.MediaMetadata({
                    title: r.title,
                    artist: (r.artist),
                    artwork: [
                        { src: imgtemp, sizes: '500x500' },
                    ],
                    album: 'Streaming on ' + r.radioname + '.'
                });
            }
            sessionStorage.setItem("control", "play");
            var date = new Date();
            var str = "Start Sync Station: " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + ('0' + date.getMinutes()).slice(-2) + ":" + ('0' + date.getSeconds()).slice(-2) + " (" + Intl.DateTimeFormat().resolvedOptions().timeZone + "'s timezone)";
            console.log('Resync', str)
          } else {
            if (btn.play == true && btn.stop == true) {
              pauseStream()
            } else if (btn.play == true && btn.stop == false && btn.stop == false) {
              stopStream()
            }
          }
        }
      })
  }

const fetchInfo = () => {
  $.ajax({
    url: Fet().ul + "/radio/apiloop?station=" + choosenstation.value,
    type: "GET",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    error: function () {
        forceerror()
    },
    success: function (r) {
      setLoad(false)
        playstat = true
        setObj(r)
        setBtn({...btn, play: false, pause: true, stop: true})
        let imgtemp;
        if (r.img == '') {
          imgtemp = 'https://cdn.jsdelivr.net/gh/cpx2017/cpxcdnbucket@main/radioth/favicon.webp'
        } else {
            imgtemp = r.img
        }
        setStreamuri(imgtemp)
        if (iOS() == true) {
          document.title = "You listening to " + r.radioname + ". (Sorry, But song metadata is not support on IOS Device)"
        } else {
          document.title = r.title + " | " + r.artist + " [" + r.radioname +"]"
        }
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new window.MediaMetadata({
                title: r.title,
                artist: (r.artist),
                artwork: [
                    { src: imgtemp, sizes: '500x500' },
                ],
                album: 'Streaming on ' + r.radioname + '.'
            });
        }
        sessionStorage.setItem("control", "play");
        var date = new Date();
        var str = "Start Sync Station: " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + ('0' + date.getMinutes()).slice(-2) + ":" + ('0' + date.getSeconds()).slice(-2) + " (" + Intl.DateTimeFormat().resolvedOptions().timeZone + "'s timezone)";
        console.log(str)
        myInterval = setInterval(function () {
          LoopAPI()
        }, 20000)
    }
})
}

  const getStream = () => {
    if (Object.keys(choosenstation).length === 0) {
      Swal.fire(
        'พบข้อผิดพลาด',
        'กรุณาเลือกสถานี',
        'warning'
      )
    } else {
      setBtn({...btn, play: false, stop: false})
      setLoad(true)
      $.ajax({
        url: Fet().ul + "/radio/getjsonapi?station=" + choosenstation.value,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        error: function () {
            forceerror()
            setBtn({...btn, play: true})
        },
        
        success: function (r) {
          let urip
          if (array1.find(element => element == choosenstation.value)) {
            urip =(r.link).replace("https", "http")
          }
         
            audioCom = new Audio(r.link)
            const platst = audioCom.play()
            let Timeo = setTimeout(function(){
              clearTimeout(Timeo)
              forceerror()
            }, 30000)
           platst
          .then(_ => {
            clearTimeout(Timeo)
            fetchInfo()
          })
          .catch(error => {
            clearTimeout(Timeo)
            forceerror()
          });
        },
    })
    }
  }

  navigator.mediaSession.setActionHandler('play', function () {
    
});
navigator.mediaSession.setActionHandler('pause', function () {
   pauseStream()
})
navigator.mediaSession.setActionHandler('stop', function () {
   stopStream()
});



  const opt = [
    {
      label: "Bangkok",
      options: [
        { label: "Cool Farenheit 93", value: "cool" },
        { label: "HITZ 955", value: "hitz" },
        { label: "Eazy FM 1055", value: "eazy" },
        { label: "Chill Online", value: "chill" },
        { label: "EFM Station", value: "efm" },
        { label: "Green Wave", value: "green" },
        { label: "ATime White Pop", value: "wp" },
        { label: "ATime Hot Wave", value: "hw" },
        { label: "ATime Cassette", value: "cs" }
      ]
    },
    {
      label: "Chonburi",
      options: [
        { label: "Sunshine Radio Pattaya", value: "sun" }
      ]
    }
  ]

  const [ pageid, setPageid ] = React.useState(1)
  React.useEffect(() => {
    if (window.location.pathname == '/') {
      setPageid(1)
    } else if (window.location.pathname == '/songinfo') {
      setPageid(2)
    } else if (window.location.pathname == '/about') {
      setPageid(3)
    }
    
  })

  const PageChange = (pageset) => {
    setPageid(pageset)
  }

  const [Collap, setCollap] = React.useState(false)

  return (
    <div className="App">
        <Slide in={region != '' ? true : false} timeout={500}>
        <AppBar position="sticky" color='primary' className='app-barcurve'>
          <Toolbar>
            {open == false && (
            <IconButton onClick={() => setOpen(true)} edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            )}
            <div>
              <Typography variant='h5' className='title' onClick={() => His.push('/')}>
               RadioTH - New Era
              </Typography>
            </div>
            <>
            {window.innerWidth > 700 ? (
              <div className={cls.search + ' mr-3'}>
              {MainLoad ? (
                <img src='https://cdn.jsdelivr.net/gh/cpx2017/cpxcdnbucket@main/main/cpx-circular.svg' width={30} />
              ) : (
              <b>{!MainLoad && !streamurl.includes('White-square.webp') ? 'Connected' : 'You are Ready'}</b>
              )}
          </div>
            ) : (
              <div className={cls.search + ' mr-3'}>
                  {MainLoad ? (
                    <img src='https://cdn.jsdelivr.net/gh/cpx2017/cpxcdnbucket@main/main/cpx-circular.svg' width={30} />
                  ) : (
                  <b>{!MainLoad && !streamurl.includes('White-square.webp') ? (<PlayCircleFilledIcon className='text-success' data-toggle="tooltip" data-placement="bottom" title="Connected" />) : (<CheckCircleOutlineIcon className='text-primary' data-toggle="tooltip" data-placement="bottom" title="You are Ready" />)}</b>
                  )}
              </div>
            )}
            </>
                
          </Toolbar>
        </AppBar>
        </Slide>
     
      <Drawer
                  className={cls.drawer}
                  variant="temporary"
                  color="primary"
                  anchor="left"
                  open={open}
                  classes={{
                    paper: cls.drawerPaper,
                  }}
                >
                <div className={cls.drawerHeader} position="fixed">
                  <IconButton onClick={() => setOpen(false)} size="large">
                    <CloseIcon />
                  </IconButton>
                </div>
                <Divider />
                <d onClick={() => setOpen(false)}>
                <ListItem component={Link} to='/' button>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItem>
                <ListItem component={Link} to='/songinfo' button>
                  <ListItemIcon>
                    <RadioIcon />
                  </ListItemIcon>
                  <ListItemText primary="Song Info" />
                </ListItem>
                <ListItem component={Link} to='/about' button>
                  <ListItemIcon>
                    <InfoIcon />
                  </ListItemIcon>
                  <ListItemText primary="About" />
                </ListItem>
                </d>
                <Divider />
                <ListItem button>
                  <ListItemIcon>
                    <PublicIcon />
                  </ListItemIcon>
                  <ListItemText primary="Current Region" secondary={region} />
                </ListItem>
                
                </Drawer>

      <div className='card pagemar text-left mt-2'>
      <Switch>
          <Route exact path="/">
            <Home obj={objData} setLoad={(val) => setLoad(val)} StillLoad={!btn.play && !btn.pause && !btn.stop ? true : false} />
          </Route>
          <Route path="/songinfo">
            <Info platstat={playstat} station={choosenstation.value} obj={objData} img={streamurl} setLoad={(val) => setLoad(val)} />
          </Route>
          <Route path="/topsong">
            <TopSong Fet={Fet().ul} setLoad={(val) => setLoad(val)} Load={MainLoad} onplay={playstat} />
          </Route>
          <Route path="/about">
            <Abo />
          </Route>
        </Switch>
      </div>
     
      {window.innerWidth >= 800 ? (
          <div class="card bg-light mt-4 sticky-bottom">
          <div class="card-body row">
          <div className="col-md-auto mt-2">
      กรุณาเลือกสถานี
      </div>
      <div className="col-md-4 text-left">
            <Select menuPlacement="top" placeholder="Please choose station" options={opt} onChange={(e) => setStation(e)} value={choosenstation} isDisabled={btn.play == false || region == 'Loading' || (btn.play == true && btn.stop == true) ? true : false} />
        </div>
        {btn.play && (
           <div className="col-md-auto">
           <button type="button" class="btn btn-outline-success" onClick={() => getStream()} disabled={region == 'Loading' || btn.play == false ? true : false}>Stream</button>
           </div>
        )}
        {btn.pause && (
           <div className="col-md-auto">
           <button type="button" class="btn btn-outline-warning" onClick={() => pauseStream()}>Pause</button>
           </div>
        )}
        {btn.stop && (
          <div className="col-md-auto">
          <button type="button" class="btn btn-outline-danger" onClick={()=> stopStream()}>Stop</button>
          </div>
        )}
        {Object.keys(objData).length > 0 && (
      <div className="col-md text-right mt-2 cur" onClick={() => His.push('/songinfo')}>
      ชื่อเพลงที่กำลังเล่นอยู่: {objData.title.substring(0,30)}{(objData.title.length > 30 && '...')} | {objData.artist.substring(0,30)}{(objData.artist.length > 30 && '...')}
      </div>
          )}
          </div>
          <hr />
        <footer className='m-1 pb-1'>
          Copyright 2022 CPXDevStudio, Allright Reserved
        </footer>
        </div>
      ) : (
        <div class="card bg-light text-left mt-4 sticky-bottom">
        <div class="card-body">
          <div className='form-group'>
            <label>กรุณาเลือกสถานี</label>
            <Select menuPlacement="top" placeholder="Please choose station" options={opt} onChange={(e) => setStation(e)} value={choosenstation} isDisabled={btn.play == false || region == 'Loading' || (btn.play == true && btn.stop == true) ? true : false} />
          </div>
          <div className='button-group'>
          {btn.play && (
                     <button type="button" class="btn btn-sm btn-outline-success mr-1" onClick={() => getStream()} disabled={region == 'Loading' || btn.play == false ? true : false}>Stream</button>
        )}
        {btn.pause && (
           <button type="button" class="btn btn-sm  btn-outline-warning mr-1" onClick={() => pauseStream()}>Pause</button>
        )}
        {btn.stop && (
          <button type="button" class="btn btn-sm  btn-outline-danger" onClick={()=> stopStream()}>Stop</button>
        )}
          </div>
          {Object.keys(objData).length > 0 && (
      <div className="col-md text-right mt-5 cur" onClick={() => His.push('/songinfo')}>
      ชื่อเพลงที่กำลังเล่นอยู่: {objData.title.substring(0,20)}{(objData.title.length > 20 && '...')} | {objData.artist.substring(0,20)}{(objData.artist.length > 20 && '...')}
      </div>
          )}
        </div>
        <hr />
      <footer className='m-1 pb-1 text-center'>
        Copyright 2022 CPXDevStudio, Allright Reserved
      </footer>
      </div>
      )}
    </div>
  );
}

export default App;
