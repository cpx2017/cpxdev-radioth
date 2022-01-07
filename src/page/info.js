import React from 'react';

import $ from 'jquery'
import 'sweetalert2/dist/sweetalert2.min.css';
import Swal from 'sweetalert2/dist/sweetalert2';
import Fet from '../fetch'

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
    
    
    return ( 
        <div className='card-body'>
             <div class="row no-gutters">
                <div class="col-md-4">
                    <img src={platstat == true && !(Object.keys(obj).length == 0) ? img :"https://cdn.jsdelivr.net/gh/cpx2017/cpxcdnbucket@latest/radioth/White-square.jpg"} id="imgpick" width="80" class="card-img" />
                </div>
                <div class="col-md">
                    <div class="card-header" id="stationcurrent">
                       {platstat == true && !(Object.keys(obj).length == 0) ? 'You listening to ' + obj.radioname : 'Please choose station below'}
                    </div>
                    <div class="card-body">
                        <h4 class="card-title" id="songtitle">{platstat == true && !(Object.keys(obj).length == 0) ? obj.title : 'Song Title'}</h4>
                        <h5 class="card-text" id="songartist">{platstat == true && !(Object.keys(obj).length == 0) ? obj.artist : 'Song Artist'}</h5>
                        <hr />
                        <p><b class="card-text" id="showtime"></b></p>
                        {platstat == true && (
                                <div>
                                     <div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
                            <a target="_blank" id="spotlink" href={platstat == true && !(Object.keys(obj).length == 0) ? obj.art : ''} class="btn btn-success" hidden={!(Object.keys(obj).length == 0) && obj.art == 'unknown' ? true : false}><i class="fab fa-spotify"></i> Listen it on Spotify</a>
                            <a target="_blank" id="itunelink" href={platstat == true && !(Object.keys(obj).length == 0) ? obj.art2 : ''} class="btn btn-danger" hidden={!(Object.keys(obj).length == 0) && obj.art2 == 'unknown' ? true : false}><i class="fab fa-itunes"></i> Avaliable on Apple Music</a>
                            <a target="_blank" id="jooxlink" href={platstat == true && !(Object.keys(obj).length == 0) ? obj.art3 : ''} class="btn btn-default joox" hidden={!(Object.keys(obj).length == 0) && obj.art3 == 'unknown' ? true : false}>Exclusive on JOOX Music</a>
                          </div>
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
    );
}
 
export default Radio;