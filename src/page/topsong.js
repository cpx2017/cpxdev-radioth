import React from 'react';
import $ from 'jquery'

const TopSong = ({Fet,setLoad}) => {
    const [ Art, setArt ] = React.useState('Unknown Artist')
    const [ Arr, setArr ] = React.useState([])
    React.useEffect(() => {
        setLoad(true)
        var url = new URL(window.location.href);
        var c = url.searchParams.get("art");
        if (c!= null) {
            setArt(c)
            $.ajax({
                url: Fet + "/radio/checktopsongartist?artist=" + c,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                error: function () {
                    setLoad(false)
                },
                success: function (r) {
                  setArr(r)
                  setLoad(false)
                }
            })
        }
    }, [])
    return ( 
        <div className='mt-3 ml-2 mr-2'>
        <h5>Top song of {Art}</h5>
        <hr />
        {Arr.length > 0 ?  (
            <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">Ranking</th>
                    <th scope="col">Song Name</th>
                    <th scope="col">Liked Count</th>
                    </tr>
                </thead>
                <tbody>
                    {Arr.map((item,i) => (
                         <tr>
                         <th scope="row">{i+1}</th>
                         <td>{item.title}</td>
                         <td>{item.countliked}</td>
                         </tr>
                    ))}
                </tbody>
            </table>
            </div>
        ):(
            <div className='text-center'>
                <h6>No records</h6>
            </div>
        )}
        </div>
     );
}
 
export default TopSong;