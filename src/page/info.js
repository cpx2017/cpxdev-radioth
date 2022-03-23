import React from 'react';

import $ from 'jquery'
import 'sweetalert2/dist/sweetalert2.min.css';
import Swal from 'sweetalert2/dist/sweetalert2';
import Fet from '../fetch'

import {
    useHistory
  } from "react-router-dom";

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import { CardActionArea } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
      },
    details: {
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      flex: 'auto',
    },
    cover: {
      width: 151,
    },
  }));

var likedLock = false;

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

const Radio = ({platstat, obj, img, setLoad}) => {
    const classes = useStyles();
    const History = useHistory()
    const [ready, setReady] = React.useState(false)
    React.useEffect(() => {
        setReady(true)
    }, [])
    function updatelike() {
        if (platstat == true && likedLock == false) {
            setLoad(true)
            likedLock = true;
            let de = setInterval(function(){
              likedLock = false
              clearInterval(de);
            }, 30000);
                $.ajax({
                    url: Fet().ul + "/radio/updatelike?name=" + obj.title + "&artist=" + obj.artist,
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: "text",
                    error: function () {
                        setLoad(false)
                        Swal.fire(
                            'พบข้อผิดพลาด',
                            'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง',
                            'error'
                          )
                    },
                    success: function (r) {
                        setLoad(false)
                       if (r === "true") {
                        Swal.fire(
                            'สำเร็จ',
                            'คุณชอบเพลง ' + $('#songtitle').html() + ' ของ ' + $('#songartist').html() +' สามารถคลิกที่ปุ่มด้านบนเพื่อเปิดฟังผ่านช่องทางสตรีมมิ่งที่คุณใช้อยู่ได้นะ',
                            'success'
                          )
                       } else {
                        Swal.fire(
                            'พบข้อผิดพลาด',
                            'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง',
                            'error'
                          )
                          $("#likecount").prop('disabled', false);
                       }
                    },
                })
            } else {
                Swal.fire(
                    'พบข้อผิดพลาด',
                    'เหตุผลด้านประสิทธิภาพของระบบ กรุณารอสักครู่',
                    'warning'
                  )
            }
        }
    
        const Checkready = () => {
            if (platstat == true && !(Object.keys(obj).length == 0) && obj.onLike == true) {
                History.push('/topsong?art=' + obj.artist)
            }
        }
    
    return ( 
         <div className='card-body'>
             <div class="row no-gutters">
                <div class="col-md-4">
                <CardMedia
                        src={platstat == true && !(Object.keys(obj).length == 0) ? img :"https://cdn.jsdelivr.net/gh/cpx2017/cpxcdnbucket@latest/radioth/White-square.webp"}
                        component="img"
                        width={60}
                    />
                </div>
                <div class="col-md">
                    {!ready ? <Skeleton /> : (
                        <div class="card-header" id="stationcurrent">
                        {platstat == true && !(Object.keys(obj).length == 0) ? 'You listening to ' + obj.radioname : 'Please choose station below'}
                    </div>
                    )}
                    
                    <div class="card-body">
                        <h4 class="card-title" id="songtitle">{platstat == true && !(Object.keys(obj).length == 0) ? obj.title : 'Song Title'}</h4>
                        <h5 class="card-text" id="songartist" className={platstat == true && !(Object.keys(obj).length == 0) && obj.onLike == true ? 'cur' : ''} onClick={() => Checkready()}>{platstat == true && !(Object.keys(obj).length == 0) ? obj.artist : 'Song Artist'}</h5>
                        <p class="card-text text-muted" id="showt">{platstat == true && !(Object.keys(obj).length == 0) ? obj.djname + ' (' + obj.showtime + ')' : ''}</p>
                        <hr />
                        <p><b class="card-text" id="showtime"></b></p>
                        {platstat == true && (
                                <div>
                                    {window.innerWidth > 600 ? (
                                              <div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
                                              <a target="_blank" id="spotlink" href={platstat == true && !(Object.keys(obj).length == 0) ? obj.art : ''} class="btn btn-success" hidden={!(Object.keys(obj).length == 0) && obj.art == 'unknown' ? true : false}><i class="fab fa-spotify"></i> Listen it on Spotify</a>
                                              <a target="_blank" id="itunelink" href={platstat == true && !(Object.keys(obj).length == 0) ? obj.art2 : ''} class="btn btn-danger" hidden={!(Object.keys(obj).length == 0) && obj.art2 == 'unknown' ? true : false}><i class="fab fa-itunes"></i> Avaliable on Apple Music</a>
                                            </div>
                                    ) : (
                                        <div class="btn-group" role="group" aria-label="Basic example">
                                        <a target="_blank" id="spotlink" href={platstat == true && !(Object.keys(obj).length == 0) ? obj.art : ''} class="btn btn-success" hidden={!(Object.keys(obj).length == 0) && obj.art == 'unknown' ? true : false}><i class="fab fa-spotify"></i></a>
                                        <a target="_blank" id="itunelink" href={platstat == true && !(Object.keys(obj).length == 0) ? obj.art2 : ''} class="btn btn-danger" hidden={!(Object.keys(obj).length == 0) && obj.art2 == 'unknown' ? true : false}><i class="fab fa-itunes"></i></a>
                                      </div>
                                    )}
                                   
                          <br />
                          {!(Object.keys(obj).length == 0) && obj.onLike == true && (
                               <button data-toggle="tooltip" data-placement="top" title={likedLock == true && 'For DDOS Attack reason. Please wait for a while.'} onClick={() => updatelike()} class="btn btn-outline-primary mt-2"><i class="far fa-thumbs-up"></i> {obj.countliked} likes of this song.</button>
                          )}
                         
                                </div>
                        )}
                       
                    </div>
                </div>
            </div>
        </div>

     
        // <div className='card-body'>
        //      <div class="row no-gutters">
        //         <div class="col-md-4">
        //             <img src={platstat == true && !(Object.keys(obj).length == 0) ? img :"https://cdn.jsdelivr.net/gh/cpx2017/cpxcdnbucket@latest/radioth/White-square.webp"} id="imgpick" width="80" class="card-img" />
        //         </div>
        //         <div class="col-md">
        //             <div class="card-header" id="stationcurrent">
        //                {platstat == true && !(Object.keys(obj).length == 0) ? 'You listening to ' + obj.radioname : 'Please choose station below'}
        //             </div>
        //             <div class="card-body">
        //                 <h4 class="card-title" id="songtitle">{platstat == true && !(Object.keys(obj).length == 0) ? obj.title : 'Song Title'}</h4>
        //                 <h5 class="card-text" id="songartist">{platstat == true && !(Object.keys(obj).length == 0) ? obj.artist : 'Song Artist'}</h5>
        //                 <p class="card-text text-muted" id="showt">{platstat == true && !(Object.keys(obj).length == 0) ? obj.djname + ' (' + obj.showtime + ')' : ''}</p>
        //                 <hr />
        //                 <p><b class="card-text" id="showtime"></b></p>
        //                 {platstat == true && (
        //                         <div>
        //                             {window.innerWidth > 600 ? (
        //                                       <div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
        //                                       <a target="_blank" id="spotlink" href={platstat == true && !(Object.keys(obj).length == 0) ? obj.art : ''} class="btn btn-success" hidden={!(Object.keys(obj).length == 0) && obj.art == 'unknown' ? true : false}><i class="fab fa-spotify"></i> Listen it on Spotify</a>
        //                                       <a target="_blank" id="itunelink" href={platstat == true && !(Object.keys(obj).length == 0) ? obj.art2 : ''} class="btn btn-danger" hidden={!(Object.keys(obj).length == 0) && obj.art2 == 'unknown' ? true : false}><i class="fab fa-itunes"></i> Avaliable on Apple Music</a>
        //                                     </div>
        //                             ) : (
        //                                 <div class="btn-group" role="group" aria-label="Basic example">
        //                                 <a target="_blank" id="spotlink" href={platstat == true && !(Object.keys(obj).length == 0) ? obj.art : ''} class="btn btn-success" hidden={!(Object.keys(obj).length == 0) && obj.art == 'unknown' ? true : false}><i class="fab fa-spotify"></i></a>
        //                                 <a target="_blank" id="itunelink" href={platstat == true && !(Object.keys(obj).length == 0) ? obj.art2 : ''} class="btn btn-danger" hidden={!(Object.keys(obj).length == 0) && obj.art2 == 'unknown' ? true : false}><i class="fab fa-itunes"></i></a>
        //                               </div>
        //                             )}
                                   
        //                   <br />
        //                   {!(Object.keys(obj).length == 0) && obj.onLike == true && (
        //                        <button data-toggle="tooltip" data-placement="top" title={likedLock == true && 'For DDOS Attack reason. Please wait for a while.'} onClick={() => updatelike()} class="btn btn-outline-primary mt-2"><i class="far fa-thumbs-up"></i> {obj.countliked} likes of this song.</button>
        //                   )}
                         
        //                         </div>
        //                 )}
                       
        //             </div>
        //         </div>
        //     </div>
        // </div>
    );
}
 
export default Radio;